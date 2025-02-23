<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auditoriums', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->string('name')->nullable();
            $table->enum('type', ['regular', 'lecture', 'computer', 'laboratory', 'conference']);
            $table->integer('capacity');
            $table->json('equipment')->nullable();
            $table->boolean('has_projector')->default(false);
            $table->boolean('has_internet')->default(false);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditoriums');
    }
};
