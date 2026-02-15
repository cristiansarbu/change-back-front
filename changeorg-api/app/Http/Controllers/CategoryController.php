<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
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

    public function index()
    {
        try {
            $categories = Category::all();
            return $this->sendResponse($categories, 'Categorías recuperadas con éxito.');
        } catch (\Exception $e) {
            return $this->sendError('Error al recuperar las categorías', $e->getMessage(), 500);
        }
    }
}
