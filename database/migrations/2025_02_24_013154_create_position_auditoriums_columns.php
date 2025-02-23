<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('auditoriums', function (Blueprint $table) {
            $table->integer('position_x')->nullable();
            $table->integer('position_y')->nullable();
            $table->integer('width')->default(100);
            $table->integer('height')->default(100);
            $table->string('shape')->default('rectangle');
        });
    }

    public function down()
    {
        Schema::table('auditoriums', function (Blueprint $table) {
            $table->dropColumn(['position_x', 'position_y', 'width', 'height', 'shape']);
        });
    }
};
