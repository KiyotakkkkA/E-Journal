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

        Schema::create('teachers_to_cafedras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers');
            $table->foreignId('cafedra_id')->constrained('cafedras');
            $table->timestamps();
        });

        Schema::create('groups_to_cafedras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups');
            $table->foreignId('cafedra_id')->constrained('cafedras');
            $table->timestamps();
        });

        Schema::create('lessons_to_teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('lessons');
            $table->foreignId('teacher_id')->constrained('teachers');
            $table->timestamps();
        });

        Schema::create('lessons_to_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('lessons');
            $table->foreignId('group_id')->constrained('groups');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers_to_cafedras');
        Schema::dropIfExists('groups_to_cafedras');
        Schema::dropIfExists('lessons_to_teachers');
        Schema::dropIfExists('lessons_to_groups');
    }
};
