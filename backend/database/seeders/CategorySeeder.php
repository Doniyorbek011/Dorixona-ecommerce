<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name_uz' => 'Dori-darmonlar',
                'name_ru' => 'Лекарственные препараты',
                'slug' => 'dori-darmonlar',
                'description' => 'Barcha turdagi retseptli va retseptsiz dori vositalari',
                'image' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'name_uz' => 'Vitaminlar va BAQ',
                'name_ru' => 'Витамины и БАДы',
                'slug' => 'vitaminlar-va-baq',
                'description' => 'Immunitetni mustahkamlovchi vitaminlar, minerallar va biologik faol qo‘shimchalar',
                'image' => 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'name_uz' => 'Tibbiy buyumlar va texnika',
                'name_ru' => 'Медицинские изделия и приборы',
                'slug' => 'tibbiy-buyumlar',
                'description' => 'Tonometrlar, termometrlar, bintlar, plasterlar va shpritslar',
                'image' => 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'name_uz' => 'Onalar va bolalar uchun',
                'name_ru' => 'Мама и малыш',
                'slug' => 'onalar-va-bolalar',
                'description' => 'Bolalar ozuqasi, tagliklar, bolalar kosmetikasi va parvarish vositalari',
                'image' => 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'name_uz' => 'Gigiyena va kosmetika',
                'name_ru' => 'Гигиена и косметика',
                'slug' => 'gigiyena-va-kosmetika',
                'description' => 'Shaxsiy gigiyena, terini parvarish qilish va dermakosmetika mahsulotlari',
                'image' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'name_uz' => 'Shoshilinch yordam va Bog‘lov',
                'name_ru' => 'Первая помощь и перевязка',
                'slug' => 'shoshilinch-yordam',
                'description' => 'Antiseptiklar, jgutlar, birinchi yordam qutichalari va jarohat parvarishi',
                'image' => 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
