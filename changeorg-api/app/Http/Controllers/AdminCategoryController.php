<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\File;
use App\Models\Petition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AdminCategoryController extends Controller
{
    public function index()
    {
        try {
            $categories = Category::all();
            return $this->sendResponse($categories, 'Categorías recuperadas con éxito.');
        } catch (\Exception $e) {
            return $this->sendError('Error al recuperar las categorías', $e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $category = Category::create([
            'name' => $request->name,
        ]);
        return response()->json([
            'message' => "Categoría creada éxitosamente",
            'category' => $category
        ], 201);
    }

    public function update(Request $request, Category $category)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        try {
            $category->update($request->all());
            return $this->sendResponse($category, 'Categoría actualizada con éxito');
        } catch (\Exception $e) {
            return $this->sendError('Error al actualizar', $e->getMessage(), 500);
        }
    }

    public function delete(Category $category)
    {
        try {
            if (Petition::where('category_id', $category->id)->count() !== 0) {
                return $this->sendError('No puedes eliminar una categoría con peticiones asociadas.', code: 400);
            }
            $category->delete();
            return $this->sendResponse(null, 'Categoría eliminada con éxito');
        } catch (\Exception $e) {
            return $this->sendError('Error al eliminar la categoría', $e->getMessage(), 500);
        }
    }
}
