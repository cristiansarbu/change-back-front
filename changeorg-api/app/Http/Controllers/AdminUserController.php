<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminUserController extends Controller
{
    public function index()
    {
        try {
            $users = User::all();
            return $this->sendResponse($users, 'Usuarios recuperados con éxito.');
        } catch (Exception $e) {
            return $this->sendError('Error al recuperar los usuarios', $e->getMessage(), 500);
        }
    }

    public function show(User $user)
    {
        try {
            return $this->sendResponse($user, 'Usuario encontrado');
        } catch (Exception $e) {
            return $this->sendError('Usuario no encontrado', $e->getMessage(), 404);
        }
    }

    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'admin' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error de validación', $validator->errors(), 422);
        }

        try {
            $user->name = $request->name;
            if ($request->has('admin')) {
                $user->admin = $request->admin;
            } else {
                $user->admin = 0;
            }
            $user->save();

            return $this->sendResponse($user, 'Usuario actualizado con éxito');
        } catch (Exception $e) {
            return $this->sendError('Error al actualizar el usuario', $e->getMessage(), 500);
        }
    }

    public function delete(User $user)
    {
        try {
            if ($user->signedPetitions()->count() > 0) {
                return $this->sendError('No se puede eliminar un usuario que ha firmado peticiones.', [], 400);
            }

            if ($user->petitions()->count() > 0) {
                return $this->sendError('No se puede eliminar un usuario que tiene peticiones.', [], 400);
            }

            $user->delete();
            return $this->sendResponse(null, 'Usuario eliminado correctamente.');
        } catch (Exception $e) {
            return $this->sendError('Error al eliminar el usuario', $e->getMessage(), 500);
        }
    }
}
