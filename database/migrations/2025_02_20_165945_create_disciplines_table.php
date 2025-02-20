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
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('discipline_id')->constrained('disciplines');
            $table->string('name');
            $table->enum('type', ['lecture', 'practice', 'lab', 'exam', 'other']);
            $table->timestamps();
        });

        Schema::create('institutes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('cafedras', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('institute_id')->constrained('institutes');
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('disciplines');
        Schema::dropIfExists('teachers');
        Schema::dropIfExists('cafedras');
        Schema::dropIfExists('institutes');
    }
};
