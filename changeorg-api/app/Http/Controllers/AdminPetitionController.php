<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\File;
use App\Models\Petition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AdminPetitionController extends Controller
{
    public function index()
    {
        try {
            $petitions = Petition::with(['files', 'user'])->get();
            return $this->sendResponse($petitions, 'Peticiones recuperadas con éxito.');
        } catch (\Exception $e) {
            return $this->sendError('Error al recuperar peticiones', $e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|max:255',
            'description' => 'required',
            'destinatary' => 'required',
            'category_id' => 'required|exists:categories,id',
            'files' => 'nullable|array',
            'files.*' => 'file|mimes:jpeg,png,jpg,svg|max:2048'
//            'file' => 'required|file|mimes:jpeg,png,jpg,svg'
        ],
            [
                'category_id.exists' => 'La categoría seleccionada no existe.'
            ],
            [
                'category_id' => 'categoría'
            ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validación', $validator->errors(), 422);
        }

//        $path = $file->store('petitions', 'public');

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
                    $petition->load(['files', 'user']);
                    return $this->sendResponse($petition, 'Petición creada con éxito', 201);
                } else {
                    return $this->sendError('Error al crear la petición', [], 500);
                }
            }
        } catch (\Exception $exception) {
            return $this->sendError('Error al crear la petición', $exception->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $petition = Petition::with(['files', 'user'])->findOrFail($id);
            return $this->sendResponse($petition, 'Petición encontrada');
        } catch (\Exception $e) {
            return $this->sendError('Petición no encontrada');
        }
    }

    public function update(Request $request, Petition $petition)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|max:255',
            'description' => 'required',
            'destinatary' => 'required',
            'category_id' => 'required|exists:categories,id',
            'files' => 'array',
            'files.*' => 'file|mimes:jpeg,png,jpg,svg|max:2048'
        ],
            [
                'category_id.exists' => 'La categoría seleccionada no existe.'
            ],
            [
                'category_id' => 'categoría'
            ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validación', $validator->errors(), 422);
        }

        $input = $request->except('files');

        try {
            $petition->update($input);

            if ($request->hasFile('files')) {
                $filesExistentes = File::where('petition_id', $petition->id)->get();
                foreach ($filesExistentes as $file) {
                    Storage::disk('public')->delete($file->file_path);
                    $file->delete();
                }
                $this->fileUpload($request, $petition->id);
            }
            $petition->load(['files', 'user']);
            return $this->sendResponse($petition, 'Petición actualizada con éxito');
        } catch (\Exception $e) {
            return $this->sendError('Error al actualizar', $e->getMessage(), 500);
        }
    }

    public function delete(Petition $petition)
    {
        try {
            $files = File::where('petition_id', $petition->id)->get();
            foreach ($files as $file) {
                Storage::disk('public')->delete($file->file_path);
                $file->delete();
            }

            $petition->signers()->detach();
            $petition->delete();
            return $this->sendResponse(null, 'Petición eliminada con éxito');
        } catch (\Exception $e) {
            return $this->sendError('Error al eliminar la petición', $e->getMessage(), 500);
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
        $petition->load(['files', 'user']);
        return $this->sendResponse($petition, 'Estado de la petición cambiado con éxito.', 201);
    }
}
