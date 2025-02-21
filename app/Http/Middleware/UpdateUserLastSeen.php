<?php

namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;

class UpdateUserLastSeen
{
    public function handle($request, Closure $next)
    {
        if (auth()->check()) {
            auth()->user()->update([
                'last_seen' => Carbon::now(),
                'is_online' => true
            ]);
        }
        return $next($request);
    }
}
