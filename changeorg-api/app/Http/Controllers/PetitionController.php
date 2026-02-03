<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\File;
use App\Models\Petition;
use App\Http\Controllers\Controller;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PetitionController extends Controller
{
    // Método auxiliar para estandarizar respuestas de éxito
    private function sendResponse($data, $message, $code = 200)
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message
        ], $code);
    }

    // Método auxiliar para estandarizar respuestas de error
    private function sendError($error, $errorMessages = [], $code = 404)
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];
        if (!empty($errorMessages)) {
            $response['errors'] = $errorMessages;
        }
        return response()->json($response, $code);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $petitions = Petition::all();
            return $this->sendResponse($petitions, 'Peticiones recuperadas con éxito.');
        } catch (\Exception $e) {
            return $this->sendError('Error al recuperar peticiones', $e->getMessage(), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|max:255',
            'description' => 'required',
            'destinatary' => 'required',
            'category_id' => 'required',
            'file' => 'required|file|mimes:jpeg,png,jpg,svg'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validación', $validator->errors(), 422);
        }

        try {
            $input = $request->all();
            $category = Category::findOrFail($input['category_id']);
            $user = Auth::user();
            $petition = new Petition($input);
            $petition->category()->associate($category);
            $petition->user()->associate($user);

            $petition->signers = 0;
            $petition->status = 'pending';

            $res = $petition->save();

            if ($res) {
                $res_file = $this->fileUpload($request, $petition->id);
                if ($res_file) {
                    return $this->sendResponse($petition, 'Petición creada con éxito', 201);
                } else {
                    return $this->sendError('Error al crear la petición', 500);
                }
            }
        } catch (\Exception $exception) {
            return $this->sendError('Error al crear la petición', 500, $exception->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $petition = Petition::findOrFail($id);
            return $this->sendResponse($petition, 'Petición encontrada');
        } catch (\Exception $e) {
            return $this->sendError('Petición no encontrada');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Petition $petition)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|max:255',
            'description' => 'required',
            'destinatary' => 'required',
            'category_id' => 'required',
            'file' => 'file|mimes:jpeg,png,jpg,svg'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validación', $validator->errors(), 422);
        }

        $input = $request->except('file');

        try {
            $petition->update($input);

            if ($request->hasFile('file')) {
                $fileExistente = File::where('petition_id', $petition->id)->first();
                $fileExistentePath = public_path('petitions/' . $fileExistente->file_path);
                unlink($fileExistentePath);
                $fileExistente->delete();

                $this->fileUpload($request, $petition->id);
            }
            return $this->sendResponse($petition, 'Petición actualizada con éxito');
        } catch (\Exception $e) {
            return $this->sendError('Error al actualizar', $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(Petition $petition)
    {
        try {
            $file = File::where('petition_id', $petition->id)->first();

            if ($file) {
                $filePath = public_path('petitions/' . $file->file_path);
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                $file->delete();
            }

            $petition->signers()->detach();
            $petition->delete();

            return $this->sendResponse(null, 'Petición eliminada con éxito');
        } catch (\Exception $e) {
            return $this->sendError('Error al eliminar la petición', $e->getMessage(), 500);
        }
    }

    public function listMine(Request $request)
    {
        try {
            $user = Auth::user();
            $petitions = $user->petitions;
            return $this->sendResponse($petitions, 'Tus peticiones han sido recuperadas con éxito.');
        } catch (\Exception $e) {
            return $this->sendError('Error al recuperar tus peticiones', $e->getMessage(), 500);
        }
    }

    public function sign(Request $request, Petition $petition)
    {
        try {
            $user = Auth::user();
            $signers = $petition->signers()->get();
            foreach ($signers as $signer) {
                if ($signer->id == $user->id) {
                    return $this->sendError('Ya has firmado esta petición.', [], 400);
                }
            }
            $user_id = [$user->id];
            $petition->signers()->attach($user_id);
            $petition->signers = $petition->signers + 1;
            $petition->save();
            return $this->sendResponse($petition, 'Petición firmada con éxito', 201);
        } catch (\Exception $e) {
            return $this->sendError('No se pudo firmar la petición', $e->getMessage(), 500);
        }
    }

    public function signedPetitions(Request $request)
    {
        try {
            $id = Auth::id();
            $user = User::findOrFail($id);
            $petitions = $user->signedPetitions;
            return $this->sendResponse($petitions, 'Peticiones firmadas recuperadas con éxito');
        } catch (\Exception $exception) {
            return  $this->sendError('No se pudieron recuperar tus peticiones firmadas.', $exception->getMessage(), 500);
        }
    }

    public function changeStatus(Petition $petition)
    {
        if ($petition->status == 'accepted') {
            $petition->status = 'pending';
        } else {
            $petition->status = 'accepted';
        }
        try {
            $petition->save();
        } catch (\Exception $exception) {
            return $this->sendError('Error actualizando el estado de la petición', $exception->getMessage(), 500);
        }
        return $this->sendResponse($petition, 'Estado de la petición cambiado con éxito.', 201);
    }

    public function fileUpload(Request $req, $petition_id = null)
    {
        $file = $req->file('file');

        $fileModel = File::where('petition_id', $petition_id)->first();
        if (!$fileModel) {
            $fileModel = new File;
            $fileModel->petition_id = $petition_id;
            if ($req->file('file')) {
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move('petitions', $filename);
                $fileModel->name = $filename;
                $fileModel->file_path = $filename;
                $res = $fileModel->save();
                return $fileModel;
            }
            return 1;
        }
    }

    public function getImage(Petition $petition)
    {
        try {
            $files = $petition->files;
            return $this->sendResponse($files, 'Imagen recuperada con éxito.');
        } catch (\Exception $exception) {
            return $this->sendError('Error recuperando la imagen.', $exception->getMessage(), 500);
        }
    }
}
