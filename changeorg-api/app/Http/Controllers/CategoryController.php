<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
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
}
