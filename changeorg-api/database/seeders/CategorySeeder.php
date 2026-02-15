<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Array con todas las categorías del change real
        $categories = [
            'Políticas Públicas',
            'Política y Gobierno',
            'Educación',
            'Animales',
            'Bienestar y Salud',
            'Gobierno',
            'Justicia Penal',
            'Bienestar de Familias y Niños',
            'Justicia Económica',
            'Medioambiente',
            'Salud Pública',
            'Derechos de los Niños',
            'Discapacidad',
            'Deportes',
            'Tecnología',
        ];

        foreach ($categories as $category) {
            Category::create(['name' => $category]);
        };
    }
}
