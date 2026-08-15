<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Demo Admin
        User::updateOrCreate(
            ['email' => 'admin@apteka.uz'],
            [
                'name' => 'Bosh Admin (Administrator)',
                'phone' => '+998901234567',
                'address' => 'Toshkent sh., Amir Temur shox ko‘chasi, 45-uy',
                'role' => 'admin',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // Demo Regular User
        User::updateOrCreate(
            ['email' => 'user@apteka.uz'],
            [
                'name' => 'Doniyor Rustamov',
                'phone' => '+998939876543',
                'address' => 'Toshkent sh., Chilonzor tumani, 9-mavze, 12-xonadon',
                'role' => 'user',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info("\n=======================================================");
        $this->command->warn(" [!] DEVELOPMENT CREDENTIALS (FOR LOCAL TESTING ONLY):");
        $this->command->info("  Admin: admin@apteka.uz | Password: password123 (Role: admin)");
        $this->command->info("  User:  user@apteka.uz  | Password: password123 (Role: user)");
        $this->command->info("=======================================================\n");
    }
}
