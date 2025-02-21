<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('disciplines', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->json('types');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(true);
            $table->string('position');
            $table->string('degree');
            $table->foreignId('cafedra_id')->nullable()->constrained('cafedras');
            $table->foreignId('user_id')->constrained('users');
            $table->timestamps();
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('discipline_id')->constrained('disciplines');
            $table->foreignId('teacher_id')->constrained('teachers');
            $table->enum('type', ['lecture', 'practice', 'lab', 'seminar']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('disciplines');
    }
};
