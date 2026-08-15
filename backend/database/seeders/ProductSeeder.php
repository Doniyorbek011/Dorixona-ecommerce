<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');

        $products = [
            // 1. Dori-darmonlar
            [
                'category_slug' => 'dori-darmonlar',
                'name' => 'Paratsetamol 500 mg N10',
                'slug' => 'paratsetamol-500-mg-n10',
                'description' => 'Isitma tushiruvchi va og‘riq qoldiruvchi samarali vosita. Shamollash, gripp va bosh og‘rig‘ida qo‘llaniladi.',
                'price' => 4500.00,
                'discount_price' => 3800.00,
                'brand' => 'Jurabek Laboratories',
                'stock' => 150,
                'image' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'dori-darmonlar',
                'name' => 'Ibuprofen 400 mg N20',
                'slug' => 'ibuprofen-400-mg-n20',
                'description' => 'Yallig‘lanishga qarshi nosteroid preparat. Bo‘g‘im, tish va mushak og‘riqlarini tez bartaraf qiladi.',
                'price' => 18000.00,
                'discount_price' => 15500.00,
                'brand' => 'Borisov Med',
                'stock' => 95,
                'image' => 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'dori-darmonlar',
                'name' => 'No-Shpa (Drotaverin) 40 mg N24',
                'slug' => 'no-shpa-40-mg-n24',
                'description' => 'Silliq mushaklar spazmini yengillashtiruvchi mashhur spazmolitik preparat.',
                'price' => 34000.00,
                'discount_price' => null,
                'brand' => 'Sanofi',
                'stock' => 80,
                'image' => 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'dori-darmonlar',
                'name' => 'Mezim Forte 10000 N20',
                'slug' => 'mezim-forte-10000-n20',
                'description' => 'Ovqat hazm qilish tizimi faoliyatini yaxshilovchi fermentativ preparat.',
                'price' => 42000.00,
                'discount_price' => 37000.00,
                'brand' => 'Berlin-Chemie',
                'stock' => 120,
                'image' => 'https://images.unsplash.com/photo-1550572017-ed200f5e6343?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'dori-darmonlar',
                'name' => 'Suprastin 25 mg N20',
                'slug' => 'suprastin-25-mg-n20',
                'description' => 'Allergiyaga qarshi tezkor ta’sirga ega birinchi avlod antigistamin vositasi.',
                'price' => 29000.00,
                'discount_price' => null,
                'brand' => 'Egis Pharmaceuticals',
                'stock' => 60,
                'image' => 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],

            // 2. Vitaminlar va BAQ
            [
                'category_slug' => 'vitaminlar-va-baq',
                'name' => 'Vitamin C 1000 mg Efervesan N20',
                'slug' => 'vitamin-c-1000-mg-n20',
                'description' => 'Eruvchan C vitamini immunitetni kuchaytiradi va umumiy tonusni oshiradi.',
                'price' => 52000.00,
                'discount_price' => 45000.00,
                'brand' => 'Doppelherz',
                'stock' => 110,
                'image' => 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'vitaminlar-va-baq',
                'name' => 'Omega-3 Premium Baliq Yog‘i 1000 mg N60',
                'slug' => 'omega-3-premium-1000-mg-n60',
                'description' => 'Yurak-qon tomir tizimi va miya faoliyatini qo‘llab-quvvatlovchi toza dengiz baliq yog‘i.',
                'price' => 115000.00,
                'discount_price' => 98000.00,
                'brand' => 'Solgar',
                'stock' => 45,
                'image' => 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'vitaminlar-va-baq',
                'name' => 'Vitamin D3 2000 IU N60 Kapsula',
                'slug' => 'vitamin-d3-2000-iu-n60',
                'description' => 'Suyaklar mustahkamligi va immunitet uchun quyosh vitamini xolekalsiferol.',
                'price' => 68000.00,
                'discount_price' => null,
                'brand' => 'Now Foods',
                'stock' => 85,
                'image' => 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'vitaminlar-va-baq',
                'name' => 'Magne B6 Forte N50',
                'slug' => 'magne-b6-forte-n50',
                'description' => 'Magniy va vitamin B6 kompleksi asab tizimi, stress va charchoqni yengishga yordam beradi.',
                'price' => 85000.00,
                'discount_price' => 74000.00,
                'brand' => 'Sanofi',
                'stock' => 70,
                'image' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],

            // 3. Tibbiy buyumlar va texnika
            [
                'category_slug' => 'tibbiy-buyumlar',
                'name' => 'Avtomatik Tonometr Omron M2 Basic',
                'slug' => 'avtomatik-tonometr-omron-m2-basic',
                'description' => 'Qon bosimini aniq va qulay o‘lchash uchun Yaponiyaning yuqori sifatli avtomatik tonometri.',
                'price' => 450000.00,
                'discount_price' => 395000.00,
                'brand' => 'Omron',
                'stock' => 25,
                'image' => 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'tibbiy-buyumlar',
                'name' => 'Kontaktsiz Infraqizil Termometr DT-8806',
                'slug' => 'kontaktsiz-termometr-dt-8806',
                'description' => '1 soniyada masofadan tana haroratini aniq o‘lchovchi zamonaviy tibbiy termometr.',
                'price' => 175000.00,
                'discount_price' => 149000.00,
                'brand' => 'B.Well',
                'stock' => 40,
                'image' => 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'tibbiy-buyumlar',
                'name' => 'Tibbiy Bir Martalik Shpritslar 5 ml N10',
                'slug' => 'tibbiy-shpritslar-5-ml-n10',
                'description' => 'Uch komponentli steril tibbiy ineksiya shpritslari to‘plami.',
                'price' => 12000.00,
                'discount_price' => null,
                'brand' => 'Asia Medical',
                'stock' => 300,
                'image' => 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],

            // 4. Onalar va bolalar uchun
            [
                'category_slug' => 'onalar-va-bolalar',
                'name' => 'Bepanten Malham (Maz) 5% 30 g',
                'slug' => 'bepanten-malham-5-30g',
                'description' => 'Dekspantenol asosidagi regeneratsiya qiluvchi malham, chaqaloqlar terisi va emizikli onalarga mos.',
                'price' => 64000.00,
                'discount_price' => 56000.00,
                'brand' => 'Bayer',
                'stock' => 90,
                'image' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'onalar-va-bolalar',
                'name' => 'Pampers Premium Care 4 (9-14 kg) 52 dona',
                'slug' => 'pampers-premium-care-4-52-dona',
                'description' => 'Nafas oluvchi yumshoq materialli chaqaloqlar uchun premium tagliklar.',
                'price' => 189000.00,
                'discount_price' => 169000.00,
                'brand' => 'Pampers',
                'stock' => 50,
                'image' => 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'onalar-va-bolalar',
                'name' => 'Nutrilon 1 Premium Bolalar Sutli Aralashmasi 800 g',
                'slug' => 'nutrilon-1-premium-800g',
                'description' => 'Tug‘ilgandan 6 oygacha bo‘lgan chaqaloqlar uchun to‘liq moslashtirilgan ozuqa.',
                'price' => 245000.00,
                'discount_price' => null,
                'brand' => 'Nutricia',
                'stock' => 35,
                'image' => 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],

            // 5. Gigiyena va kosmetika
            [
                'category_slug' => 'gigiyena-va-kosmetika',
                'name' => 'Bioderma Sensibio H2O Mitsellyar Suv 500 ml',
                'slug' => 'bioderma-sensibio-h2o-500ml',
                'description' => 'Ta’sirchan teri uchun dermatologik tozalovchi va bo‘yoqlarni ketkazuvchi losyon.',
                'price' => 230000.00,
                'discount_price' => 198000.00,
                'brand' => 'Bioderma',
                'stock' => 40,
                'image' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'gigiyena-va-kosmetika',
                'name' => 'CeraVe Quruq Teri Uchun Yuvish Geli 236 ml',
                'slug' => 'cerave-namlantiruvchi-yuvish-geli-236ml',
                'description' => 'Keramidlar va gialuron kislotasi bilan terining himoya to‘sig‘ini tiklovchi tozalovchi emulsiya.',
                'price' => 165000.00,
                'discount_price' => 145000.00,
                'brand' => 'CeraVe',
                'stock' => 55,
                'image' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'gigiyena-va-kosmetika',
                'name' => 'DentaSept Tish Pastasi Sensitive 75 ml',
                'slug' => 'dentasept-tish-pastasi-75ml',
                'description' => 'Sezuvchan tish emali va milklar uchun himoyalovchi ftorli tibbiy tish pastasi.',
                'price' => 28000.00,
                'discount_price' => null,
                'brand' => 'Lacalut',
                'stock' => 110,
                'image' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],

            // 6. Shoshilinch yordam va Bog‘lov
            [
                'category_slug' => 'shoshilinch-yordam',
                'name' => 'Xlorgeksidin Biglyukonat 0.05% 100 ml',
                'slug' => 'xlorgeksidin-0-05-100ml',
                'description' => 'Universal antiseptik va dezinfeksiya eritmasi. Jarohatlarni tozalashda ishlatiladi.',
                'price' => 3500.00,
                'discount_price' => null,
                'brand' => 'Samarqand Dori',
                'stock' => 250,
                'image' => 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'shoshilinch-yordam',
                'name' => 'Steril Doka Binti 7 m x 14 sm',
                'slug' => 'steril-doka-binti-7m-14sm',
                'description' => '100% paxtadan tayyorlangan, yuqori darajada gigroskopik tibbiy steril bint.',
                'price' => 4000.00,
                'discount_price' => 3200.00,
                'brand' => 'Textile Med',
                'stock' => 400,
                'image' => 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
            [
                'category_slug' => 'shoshilinch-yordam',
                'name' => 'Bakteritsid Plaster To‘plami N20',
                'slug' => 'bakteritsid-plaster-toplami-n20',
                'description' => 'Har xil o‘lchamdagi suv o‘tkazmaydigan, gipoallergen antibakterial plasterlar.',
                'price' => 15000.00,
                'discount_price' => 12000.00,
                'brand' => 'Master Uni',
                'stock' => 180,
                'image' => 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=80',
                'status' => true,
            ],
        ];

        foreach ($products as $item) {
            $catSlug = $item['category_slug'];
            unset($item['category_slug']);

            if (isset($categories[$catSlug])) {
                $item['category_id'] = $categories[$catSlug]->id;
                Product::updateOrCreate(['slug' => $item['slug']], $item);
            }
        }
    }
}
