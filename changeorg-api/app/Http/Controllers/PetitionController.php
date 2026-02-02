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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $petitions = Petition::all();
        return response()->json(['data' => $petitions], 200);
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
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $input = $request->all();

        try {
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
                    return response()->json(['data' => $petition, 'message' => 'Petición creada correctamente.'], 200);
                } else {
                    return response()->json(['status' => 'error', 'message' => 'No se ha podido crear la petición.'], 500);
                }
            }
        } catch (\Exception $exception) {
            return response()->json(['status' => 'error', 'message' => 'No se ha podido crear la petición.'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Petition $petition)
    {
        return response()->json(['data' => $petition], 200);
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
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
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

            return response()->json(['data' => $petition, 'message' => 'Petición actualizada correctamente.'], 200);
        } catch (\Exception) {
            return response()->json(['status' => 'error', 'message' => 'No se ha podido actualizar la petición.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(Petition $petition) {
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

            return response()->json(['data' => null, 'message' => 'Petición eliminada correctamente.'], 200);
        } catch (\Exception) {
            return response()->json(['status' => 'error', 'message' => 'No se ha podido borrar la petición.'], 500);
        }
    }

    public function listMine(Request $request)
    {
        try {
            $user = Auth::user();
            $petitions = $user->petitions;
            return response()->json(['data' => $petitions], 200);
        } catch (\Exception $exception) {
            return response()->json(['status' => 'error', 'message' => 'No se han podido mostrar tus peticiones.'], 500);
        }
    }

    public function sign(Request $request, Petition $petition) {
        try {
            $user = Auth::user();
            $signers = $petition->signers()->get();
            foreach ($signers as $signer) {
                if ($signer->id == $user->id) {
                    return response()->json(['status' => 'error', 'message' => 'Ya has firmado esta petición.'], 400);
                }
            }
            $user_id = [$user->id];
            $petition->signers()->attach($user_id);
            $petition->signers = $petition->signers + 1;
            $petition->save();
            return response()->json(['data' => null, 'message' => 'Petición firmada con éxito.'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'No se ha podido firmar esta petición.'], 500);
        }
    }

    public function signedPetitions(Request $request) {
        $id = Auth::id();
        $user = User::findOrFail($id);
        $petitions = $user->signedPetitions;
        return response()->json(['data' => $petitions], 200);
    }

    public function changeStatus(Petition $petition) {
        if ($petition->status == 'accepted') {
            $petition->status = 'pending';
        } else {
            $petition->status = 'accepted';
        }
        try {
            $petition->save();
        } catch (\Exception ) {
            return response()->json(['data' => null, 'message' => 'Error actualizando el estado de la petición'], 500);
        }
        return response()->json(['data' => $petition, 'message' => 'Estado de la petición cambiado con éxito.'], 201);
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

    public function getImage(Petition $petition) {
        $files = $petition->files;
        return response()->json(['data' => $files]);
    }
}
