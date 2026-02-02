<?php

namespace App\Providers;
use App\Models\Petition;
use App\Policies\PetitionPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Petition::class => PetitionPolicy::class,
    ];

    public function boot(): void {
        $this->registerPolicies();
    }
}
