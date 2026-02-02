<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Petition extends Model
{
    protected $table = 'petitions';
    protected $fillable = [
        'title',
        'description',
        'destinatary',
        'signers',
        'status',
        'category_id',
    ];

    protected $hidden = [
        'user_id',
    ];
    public function category() {
        return $this->belongsTo('App\Models\Category');
    }

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function signers() {
        return $this->belongsToMany('App\Models\User', 'petition_user')->withTimestamps();
    }

    public function files() {
        return $this->hasMany('App\Models\File');
    }
}
