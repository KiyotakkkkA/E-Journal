<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('auditoriums', function (Blueprint $table) {
            $table->integer('floor')->default(1)->after('capacity');
        });
    }

    public function down()
    {
        Schema::table('auditoriums', function (Blueprint $table) {
            $table->dropColumn('floor');
        });
    }
};
