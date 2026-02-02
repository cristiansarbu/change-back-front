<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = 'files';
    protected $fillable = ['name', 'file_path', 'petition_id'];
    // Campo extra para la url de la imagen
    protected $appends = ['url'];

    public function petition() {
        return $this->belongsTo('App\Models\Petition', 'petition_id');
    }

    // Método mágico accesor que se ejecuta automáticamente para el atributo de $appends con el nombre "Url"
    public function getUrlAttribute() {
        return asset('petitions/' . $this->file_path);
    }
}
