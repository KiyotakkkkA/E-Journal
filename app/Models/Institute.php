<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Institute extends Model
{
    use HasFactory;

    protected $fillable = ["name", "is_active"];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function makeDeleted()
    {
        $this->is_active = false;
        $this->save();

        $this->cafedras->each->makeDeleted();
    }

    public function cafedras()
    {
        return $this->hasMany(Cafedra::class)->where('is_active', true);
    }
}
