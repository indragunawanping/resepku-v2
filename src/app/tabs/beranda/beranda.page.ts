import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

export interface HighestScoreRecipe {
  title: string;
  value: number;
}

export interface Recipe {
  id?: string;
  imageUrl?: string;
  type?: string;
  title: string;
  portions?: string;
  duration?: string;
  ingredients?: Ingredient[];
  steps?: Step[];
  jaroWinklerDistance?: number;
}

export interface Ingredient {
  ingredientType: string;
  ingredientDetail: string[];
}

export interface Step {
  stepType: string;
  stepDetail: string[];
}

@Component({
  selector: 'app-beranda',
  templateUrl: './beranda.page.html',
  styleUrls: ['./beranda.page.scss'],
})

export class BerandaPage implements OnInit {

  constructor(
    public recipeService: RecipeService,
    public loadingController: LoadingController,
    public storageService: StorageService,
    public alertController: AlertController
  ) {
  }

  forSearchRecipes: Recipe[] = [];
  searchQuery = '';
  mostSimilarRecipes: Recipe[] = [];
  isSearchFocus = false;
  recipeType: string;
  recipeTypeDisplay: string;

  typoRecipes = ['lrv1D13OJwazH4dfKoqG',
    'n8n7icdHtAMnnL0Gf1Jb',
    'MePCzsvCxNCytOXDSuXY',
    'VwyLbPfqZ9NGvgYDrcMj',
    'KwND7uOs2r21SbUnTgjm'
  ];

  toTestRecipes = ['Rendang Padang Kering',
    'Ayam Rica-Rica Sederhana',
    'Ayam Rica-Rica Kemangi',
    'Ayam Rica-Rica Pedas Manis',
    'Ayam Rica-Rica Khas Manado',
    'Ayam Geprek Sambal Setan',
    'Ayam Geprek Keju',
    'Kulit Ayam Krispi',
    'Ayam Goreng Bumbu Kunyit',
    'Ayam Mentega',
    'Ayam Goreng Lengkuas Khas Bandung',
    'Ayam Goreng Kremes',
    'Ayam Bakar Khas Padang',
    'Sop Daging Kambing Bening',
    'Sop Iga Kuah Bumbu Rempah',
    'Coto Makassar',
    'Soto Madura',
    'Soto Ayam Ambengan',
    'Soto Banjarmasin',
    'Sate Daging Sapi Bumbu Santan',
    'Sate Padang',
    'Sate Kambing',
    'Tongseng Daging Sapi',
    'Gulai Daging Sapi Khas Solo',
    'Opor Daging Sapi',
    'Ati Ayam Bumbu Merah',
    'Ati Ampela Bumbu Kecap',
    'Ati Ampela Bumbu Kuning',
    'Ati Ampela Goreng',
    'Ati Ayam Bumbu Balado',
    'Nasi Goreng Spesial Ala Chef Marinka',
    'Nasi Uduk Hijau Sambal Kacang',
    'Nasi Uduk Betawi',
    'Nasi Uduk Aroma Daun Jeruk',
    'Nasi Liwet',
    'Nasi Bukhari Daging Kambing',
    'Nasi Bumbu Rempah Kari',
    'Nasi Goreng Merah',
    'Nasi Goreng Tomat',
    'Nasi Goreng Tabur Telur Dadar',
    'Nasi Goreng India',
    'Nasi Goreng Sukiyaki',
    'Nasi Goreng Kemangi',
    'Nasi Goreng Telur Asin',
    'Nasi Goreng Lada Hitam',
    'Nasi Roll Ayam Jamur',
    'Nasi Kuning',
    'Tumpeng Nasi Kuning',
    'Nasi Lemak Melayu Kukus',
    'Nasi Bakar Ikan Peda',
    'Nasi Bakar Ayam Peda Kemangi',
    'Nasi Bakar Ikan Tuna',
    'Nasi Bakar Cumi',
    'Ketupat Sayur',
    'Nasi Pepes Kukus Sayur',
    'Bubur Ayam Klasik Original',
    'Bubur Manado',
    'Bubur Ayam Ala Resto',
    'Nasi Ulam Khas Betawi',
    'Nasi Tim Ayam Jamur',
    'Sayur Asem Lamtoro',
    'Sayur Asem Jakarta',
    'Sayur Asem Kerupuk Ikan',
    'Sayur Asem Kreasi Ceker Ayam',
    'Sayur Asem Kreasi Kangkung',
    'Sayur Asem Khas Jawa Tengah',
    'Telur Ceplok Kecap',
    'Tempe Krispi Bumbu Ketumbar',
    'Tempe Goreng Lengkuas',
    'Tempe Mendoan Khas Purwokerto',
    'Perkedel Kentang',
    'Perkedel Jagung Ala Manado',
    'Perkedel Tempe Goreng Celup',
    'Perkedel Tempe Campur Jamur',
    'Sayur Lodeh Tewel Sayuran Ala Chef Rudy',
    'Sayur Lodeh Campur Daging',
    'Sayur Bayam Tumis Air',
    'Tumis Sawi Sendok',
    'Tumis Sayur Sawi Hijau Cah Udang',
    'Tumis Kangkung Bumbu Rica-Rica',
    'Tumis Buncis Asam Pedas',
    'Sayur Bening Buncis dan Tahu',
    'Sup Kepiting',
    'Sup Seafood Lemon Kuah',
    'Sup Daging Sapi Bening',
    'Sayur Sop/Sup Sosis Bakso',
    'Tahu Goreng Capcay',
    'Sup Tahu Ayam',
    'Tahu Putih Cabe Garam',
    'Martabak Tahu',
    'Gulai Ikan Mas Tanpa Santan',
    'Ikan Mas Goreng Bumbu Kunyit',
    'Ikan Mas Goreng Tepung',
    'Ikan Mas Bakar',
    'Ikan Mas Bumbu Rica-Rica',
    'Pepes Ikan Mas Bumbu Padang',
    'Ikan Mas Bakar Bumbu Pedas',
    'Ikan Mas Bakar Bumbu Merah',
    'Pecel Lele Goreng Sambal Bawang',
    'Ikan Kakap Saus Tiram',
    'Ikan Gurame Tepung Asam Manis',
    'Ikan Gurame Bakar Kecap Pedas',
    'Pindang Ikan Patin',
    'Udang Goreng Saus Mentega',
    'Udang Saus Asam Manis',
    'Udang Saus Tiram',
    'Udang Balado Campur Pete',
    'Udang Bakar Khas Jimbaran',
    'Udang Goreng Bumbu Rempah',
    'Udang Goreng Tumis Telur Asin dan Kapri',
    'Udang Goreng Tepung Bumbu Rendang',
    'Kepiting Saus Mentega',
    'Kepiting Saus Padang',
    'Kepiting Soka Lada Hitam',
    'Kepiting Soka Goreng Tepung Crispy',
    'Kepiting Saus Tiram',
    'Kepiting Saus Telur Asin',
    'Kepiting Saus Singapore',
    'Kepiting Asam Manis Pedas',
    'Kerang Tahu Masak Saus Tiram',
    'Bakmi Rebus Kuah',
    'Bakmi Medan',
    'Bakmi Padang',
    'Bola-Bola Mi Goreng',
    'Mi Ayam Vegetarian',
    'Mi Ayam Jamur Bakso Spesial',
    'Mi Ayam Bakso Pangsit',
    'Mi Ayam Jamur Merang',
    'Mi Jawa Kuah',
    'Mi Aceh',
    'Mi Celor',
    'Mi Cakalang Goreng',
    'Mi Kangkung Ayam',
    'Mi Tek-Tek Seafood',
    'Mi Tek-Tek Jawa Spesial',
    'Mi Tek-Tek Palembang',
    'Mi Tek-Tek Goreng',
    'Mi Laksa Khas Palembang',
    'Mi Laksa Betawi',
    'Mi Kocok Medan',
    'Mi Kocok Bakso',
    'Omelete Mi Kornet',
    'Kwetiau Kuah',
    'Kwetiau Kuah Telur',
    'Kwetiau Goreng Telur',
    'Kwetiau Goreng Spesial Pedas',
    'Kwetiau Goreng Sapi',
    'Kwetiau Siram Sapi',
    'Kwetiau Ayam Kreasi Madu',
    'Kwetiau Goreng Seafood',
    'Kue Brownies Keju',
    'Kue Brownies Coklat Keju',
    'Kue Brownies Kukus Amanda',
    'Donat Abon',
    'Sate Donat Ubi',
    'Donat Kukus Milo',
    'Donat Sandwich',
    'Uli Bakar Serundeng',
    'Kue Cucur Pandan',
    'Kue Cucur Gula Merah',
    'Kue Bawang Keju',
    'Kue Kastangel Keju',
    'Kue Sagu Keju',
    'Kue Nastar Keju',
    'Kue Kering Kacang Tanah',
    'Kue Kering Lidah Kucing Keju',
    'Kue Putri Salju',
    'Kue Kering Cokelat Keju Mete',
    'Kue Sus Kering',
    'Hot Dog Mini',
    'Roti Sobek',
    'Roti Tawar',
    'Roti Bakar Coklat Keju',
    'Roti Bakar Sosis Keju',
    'Roti Bakar Keju Daging',
    'Blueberry Oreo Mousse',
    'Chocolate Mousse',
    'Avocado Mousse',
    'Pie with Cheese Mousse',
    'Pudding Coklat Kreasi Biskuit Kelapa',
    'Onigiri Tuna',
    'Tempura Udang Jepang',
    'Tempura Jamur Tiram',
    'Tempura Sosis',
    'Tempura Ikan Tenggiri',
    'Tempura Tahu Udang Garing',
    'Tempura Sayur',
    'Tempura Daging Lengkap',
    'Yakiniku Beef',
    'Yakiniku Chicken',
    'Takoyaki',
    'Takoyaki Makaroni',
    'Kue Mochi',
    'Kue Mochi Kacang Hijau Kukus',
    'Karage Ala Jepang',
    'Udon Kuah Ala Jepang',
    'Sashimi Ala Jepang',
    'Sushi Roll',
    'Sushi Roll Goreng',
    'Ayam Teriyaki',
    'Beef Teriyaki',
    'Suimono Ala Jepang',
    'Shabu-Shabu Seafood',
    'Yakitori Ayam Tabur Shicimi',
    'Yakitori Ayam dengan Paprika',
    'Yakitori Seafood',
    'Yakitori Saus Tiram',
    'Yakitori Saus Teriyaki',
    'Beef Yakitori',
    'Okonomiyaki',
    'Wonton Soup',
    'Wonton Goreng Isi Ikan',
    'Pangsit Kuah Gurih',
    'Tahu Mapo',
    'Sapo Tahu Ayam',
    'Koloke Ayam',
    'Bebek Peking Panggang',
    'Ayam Pengemis',
    'Ayam Kung Pao',
    'Ayam Hainan',
    'Bakpao Isi Kacang Merah',
    'Bakpao Ketan Hitam Kukus',
    'Dim Sum Siomay Ikan',
    'Capcay Goreng',
    'Capcay Kuah Sayur',
    'Capcay Kuah Seafood',
    'Capcay Saus Tiram',
    'Capcay Kuah Merah',
    'Capcay Kuah Pedas',
    'Capcay Kuah Bakso',
    'Capcay Printil',
    'Fuyunghai Sayur',
    'Fuyunghai Mie',
    'Fuyunghai Kepiting',
    'Fuyunghai Udang',
    'Fuyunghai Tahu',
    'Fuyunghai Ayam Telur Bebek',
    'Fuyunghai Tepung Terigu',
    'Ifumie Seafood',
    'Bihun/Mihun Goreng Komplit Spesial',
    'Spaghetti',
    'Macaroni Saus Carbonara',
    'Fusilli Panggang',
    'Lasagna Bolognese Panggang',
    'Fettucini Alfredo',
    'Mac Cheese',
    'Spaghetti Saus Tuna',
    'Pizza Barbeque',
    'Pizza Ayam Saus Nanas',
    'Pizza Topping/Tabur Sosis Spesial',
    'Pizza Seafood Spesial',
    'Pizza French Toast',
    'Pizza Mini Sosis',
    'Pizza Keju Mozarella',
    'Chicken Grilled Italian Seasoning',
    'Rolade Daging Ayam Saus Italia',
    'Ravioli Beef dengan Saus Tomat',
    'Ravioli Creamy Mushroom Cheese',
    'Tortellini dengan Saus Krim Jamur',
    'Tortellini Mozarella',
    'Tortellini Isi Ayam Saus Cream',
    'Sup Tortellini Kental',
    'Risotto Ayam Sayuran',
    'Risotto Primavera',
    'Risotto Seafood',
    'Risotto Salmon',
    'Risotto Jamur',
    'Risotto Basic',
    'Risotto Sayuran',
    'Risotto Keju Parmesan'];

  async ngOnInit() {
    this.presentLoading();
    if (this.forSearchRecipes.length === 0) {
      this.getForSearchRecipes();
    }
    document.getElementById('list-recipe-type').style.display = 'none';
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 1000
    });
    await loading.present();
  }

  getForSearchRecipes() {
    this.forSearchRecipes = this.recipeService.getForSearchRecipes();
  }

  async handleExitApp() {
    const alert = await this.alertController.create({
      message: 'Anda yakin ingin <strong>keluar</strong>?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ya, Saya yakin',
          handler: async () => {
            // @ts-ignore
            navigator.app.exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  handleTypoGenerationDeletion() {
    const recipeArr = [
      'Rendang Padang Kering',
      'Ayam Rica-Rica Sederhana',
      'Ayam Rica-Rica Kemangi',
      'Ayam Rica-Rica Pedas Manis',
      'Ayam Rica-Rica Khas Manado',
      'Ayam Geprek Sambal Setan',
      'Ayam Geprek Keju',
      'Kulit Ayam Krispi',
      'Ayam Goreng Bumbu Kunyit',
      'Ayam Mentega',
      'Ayam Goreng Lengkuas Khas Bandung',
      'Ayam Goreng Kremes',
      'Ayam Bakar Khas Padang',
      'Sop Daging Kambing Bening',
      'Sop Iga Kuah Bumbu Rempah',
      'Coto Makassar',
      'Soto Madura',
      'Soto Ayam Ambengan',
      'Soto Banjarmasin',
      'Sate Daging Sapi Bumbu Santan',
      'Sate Padang',
      'Sate Kambing',
      'Tongseng Daging Sapi',
      'Gulai Daging Sapi Khas Solo',
      'Opor Daging Sapi',
      'Ati Ayam Bumbu Merah',
      'Ati Ampela Bumbu Kecap',
      'Ati Ampela Bumbu Kuning',
      'Ati Ampela Goreng',
      'Ati Ayam Bumbu Balado',
      'Nasi Goreng Spesial Ala Chef Marinka',
      'Nasi Uduk Hijau Sambal Kacang',
      'Nasi Uduk Betawi',
      'Nasi Uduk Aroma Daun Jeruk',
      'Nasi Liwet',
      'Nasi Bukhari Daging Kambing',
      'Nasi Bumbu Rempah Kari',
      'Nasi Goreng Merah',
      'Nasi Goreng Tomat',
      'Nasi Goreng Tabur Telur Dadar',
      'Nasi Goreng India',
      'Nasi Goreng Sukiyaki',
      'Nasi Goreng Kemangi',
      'Nasi Goreng Telur Asin',
      'Nasi Goreng Lada Hitam',
      'Nasi Roll Ayam Jamur',
      'Nasi Kuning',
      'Tumpeng Nasi Kuning',
      'Nasi Lemak Melayu Kukus',
      'Nasi Bakar Ikan Peda',
      'Nasi Bakar Ayam Peda Kemangi',
      'Nasi Bakar Ikan Tuna',
      'Nasi Bakar Cumi',
      'Ketupat Sayur',
      'Nasi Pepes Kukus Sayur',
      'Bubur Ayam Klasik Original',
      'Bubur Manado',
      'Bubur Ayam Ala Resto',
      'Nasi Ulam Khas Betawi',
      'Nasi Tim Ayam Jamur',
      'Sayur Asem Lamtoro',
      'Sayur Asem Jakarta',
      'Sayur Asem Kerupuk Ikan',
      'Sayur Asem Kreasi Ceker Ayam',
      'Sayur Asem Kreasi Kangkung',
      'Sayur Asem Khas Jawa Tengah',
      'Telur Ceplok Kecap',
      'Tempe Krispi Bumbu Ketumbar',
      'Tempe Goreng Lengkuas',
      'Tempe Mendoan Khas Purwokerto',
      'Perkedel Kentang',
      'Perkedel Jagung Ala Manado',
      'Perkedel Tempe Goreng Celup',
      'Perkedel Tempe Campur Jamur',
      'Sayur Lodeh Tewel Sayuran Ala Chef Rudy',
      'Sayur Lodeh Campur Daging',
      'Sayur Bayam Tumis Air',
      'Tumis Sawi Sendok',
      'Tumis Sayur Sawi Hijau Cah Udang',
      'Tumis Kangkung Bumbu Rica-Rica',
      'Tumis Buncis Asam Pedas',
      'Sayur Bening Buncis dan Tahu',
      'Sup Kepiting',
      'Sup Seafood Lemon Kuah',
      'Sup Daging Sapi Bening',
      'Sayur Sop/Sup Sosis Bakso',
      'Tahu Goreng Capcay',
      'Sup Tahu Ayam',
      'Tahu Putih Cabe Garam',
      'Martabak Tahu',
      'Gulai Ikan Mas Tanpa Santan',
      'Ikan Mas Goreng Bumbu Kunyit',
      'Ikan Mas Goreng Tepung',
      'Ikan Mas Bakar',
      'Ikan Mas Bumbu Rica-Rica',
      'Pepes Ikan Mas Bumbu Padang',
      'Ikan Mas Bakar Bumbu Pedas',
      'Ikan Mas Bakar Bumbu Merah',
      'Pecel Lele Goreng Sambal Bawang',
      'Ikan Kakap Saus Tiram',
      'Ikan Gurame Tepung Asam Manis',
      'Ikan Gurame Bakar Kecap Pedas',
      'Pindang Ikan Patin',
      'Udang Goreng Saus Mentega',
      'Udang Saus Asam Manis',
      'Udang Saus Tiram',
      'Udang Balado Campur Pete',
      'Udang Bakar Khas Jimbaran',
      'Udang Goreng Bumbu Rempah',
      'Udang Goreng Tumis Telur Asin dan Kapri',
      'Udang Goreng Tepung Bumbu Rendang',
      'Kepiting Saus Mentega',
      'Kepiting Saus Padang',
      'Kepiting Soka Lada Hitam',
      'Kepiting Soka Goreng Tepung Crispy',
      'Kepiting Saus Tiram',
      'Kepiting Saus Telur Asin',
      'Kepiting Saus Singapore',
      'Kepiting Asam Manis Pedas',
      'Kerang Tahu Masak Saus Tiram',
      'Bakmi Rebus Kuah',
      'Bakmi Medan',
      'Bakmi Padang',
      'Bola-Bola Mi Goreng',
      'Mi Ayam Vegetarian',
      'Mi Ayam Jamur Bakso Spesial',
      'Mi Ayam Bakso Pangsit',
      'Mi Ayam Jamur Merang',
      'Mi Jawa Kuah',
      'Mi Aceh',
      'Mi Celor',
      'Mi Cakalang Goreng',
      'Mi Kangkung Ayam',
      'Mi Tek-Tek Seafood',
      'Mi Tek-Tek Jawa Spesial',
      'Mi Tek-Tek Palembang',
      'Mi Tek-Tek Goreng',
      'Mi Laksa Khas Palembang',
      'Mi Laksa Betawi',
      'Mi Kocok Medan',
      'Mi Kocok Bakso',
      'Omelete Mi Kornet',
      'Kwetiau Kuah',
      'Kwetiau Kuah Telur',
      'Kwetiau Goreng Telur',
      'Kwetiau Goreng Spesial Pedas',
      'Kwetiau Goreng Sapi',
      'Kwetiau Siram Sapi',
      'Kwetiau Ayam Kreasi Madu',
      'Kwetiau Goreng Seafood',
      'Kue Brownies Keju',
      'Kue Brownies Coklat Keju',
      'Kue Brownies Kukus Amanda',
      'Donat Abon',
      'Sate Donat Ubi',
      'Donat Kukus Milo',
      'Donat Sandwich',
      'Uli Bakar Serundeng',
      'Kue Cucur Pandan',
      'Kue Cucur Gula Merah',
      'Kue Bawang Keju',
      'Kue Kastangel Keju',
      'Kue Sagu Keju',
      'Kue Nastar Keju',
      'Kue Kering Kacang Tanah',
      'Kue Kering Lidah Kucing Keju',
      'Kue Putri Salju',
      'Kue Kering Cokelat Keju Mete',
      'Kue Sus Kering',
      'Hot Dog Mini',
      'Roti Sobek',
      'Roti Tawar',
      'Roti Bakar Coklat Keju',
      'Roti Bakar Sosis Keju',
      'Roti Bakar Keju Daging',
      'Blueberry Oreo Mousse',
      'Chocolate Mousse',
      'Avocado Mousse',
      'Pie with Cheese Mousse',
      'Pudding Coklat Kreasi Biskuit Kelapa',
      'Onigiri Tuna',
      'Tempura Udang Jepang',
      'Tempura Jamur Tiram',
      'Tempura Sosis',
      'Tempura Ikan Tenggiri',
      'Tempura Tahu Udang Garing',
      'Tempura Sayur',
      'Tempura Daging Lengkap',
      'Yakiniku Beef',
      'Yakiniku Chicken',
      'Takoyaki',
      'Takoyaki Makaroni',
      'Kue Mochi',
      'Kue Mochi Kacang Hijau Kukus',
      'Karage Ala Jepang',
      'Udon Kuah Ala Jepang',
      'Sashimi Ala Jepang',
      'Sushi Roll',
      'Sushi Roll Goreng',
      'Ayam Teriyaki',
      'Beef Teriyaki',
      'Suimono Ala Jepang',
      'Shabu-Shabu Seafood',
      'Yakitori Ayam Tabur Shicimi',
      'Yakitori Ayam dengan Paprika',
      'Yakitori Seafood',
      'Yakitori Saus Tiram',
      'Yakitori Saus Teriyaki',
      'Beef Yakitori',
      'Okonomiyaki',
      'Wonton Soup',
      'Wonton Goreng Isi Ikan',
      'Pangsit Kuah Gurih',
      'Tahu Mapo',
      'Sapo Tahu Ayam',
      'Koloke Ayam',
      'Bebek Peking Panggang',
      'Ayam Pengemis',
      'Ayam Kung Pao',
      'Ayam Hainan',
      'Bakpao Isi Kacang Merah',
      'Bakpao Ketan Hitam Kukus',
      'Dim Sum Siomay Ikan',
      'Capcay Goreng',
      'Capcay Kuah Sayur',
      'Capcay Kuah Seafood',
      'Capcay Saus Tiram',
      'Capcay Kuah Merah',
      'Capcay Kuah Pedas',
      'Capcay Kuah Bakso',
      'Capcay Printil',
      'Fuyunghai Sayur',
      'Fuyunghai Mie',
      'Fuyunghai Kepiting',
      'Fuyunghai Udang',
      'Fuyunghai Tahu',
      'Fuyunghai Ayam Telur Bebek',
      'Fuyunghai Tepung Terigu',
      'Ifumie Seafood',
      'Bihun/Mihun Goreng Komplit Spesial',
      'Spaghetti',
      'Macaroni Saus Carbonara',
      'Fusilli Panggang',
      'Lasagna Bolognese Panggang',
      'Fettucini Alfredo',
      'Mac Cheese',
      'Spaghetti Saus Tuna',
      'Pizza Barbeque',
      'Pizza Ayam Saus Nanas',
      'Pizza Topping/Tabur Sosis Spesial',
      'Pizza Seafood Spesial',
      'Pizza French Toast',
      'Pizza Mini Sosis',
      'Pizza Keju Mozarella',
      'Chicken Grilled Italian Seasoning',
      'Rolade Daging Ayam Saus Italia',
      'Ravioli Beef dengan Saus Tomat',
      'Ravioli Creamy Mushroom Cheese',
      'Tortellini dengan Saus Krim Jamur',
      'Tortellini Mozarella',
      'Tortellini Isi Ayam Saus Cream',
      'Sup Tortellini Kental',
      'Risotto Ayam Sayuran',
      'Risotto Primavera',
      'Risotto Seafood',
      'Risotto Salmon',
      'Risotto Jamur',
      'Risotto Basic',
      'Risotto Sayuran',
      'Risotto Keju Parmesan'
    ];

    for (const recipe of recipeArr) {
      const splittedRecipes = recipe.split(' ');

      let typoDeletionRecipeWord = '';
      let typoDeletionRecipeTitle = '';

      for (const splittedRecipe of splittedRecipes) {
        const randomCharFromSplittedRecipe = splittedRecipe.charAt(Math.random() * splittedRecipe.length);
        const emptyString = '';
        typoDeletionRecipeWord = splittedRecipe.replace(randomCharFromSplittedRecipe, emptyString);
        typoDeletionRecipeTitle += typoDeletionRecipeWord + ' ';
      }
      typoDeletionRecipeTitle = typoDeletionRecipeTitle.slice(0, -1);
      console.log('\'' + typoDeletionRecipeTitle + '\',');
    }
  }

  handleTypoGenerationInsertion() {
    const recipeArr = [
      'Rendang Padang Kering',
      'Ayam Rica-Rica Sederhana',
      'Ayam Rica-Rica Kemangi',
      'Ayam Rica-Rica Pedas Manis',
      'Ayam Rica-Rica Khas Manado',
      'Ayam Geprek Sambal Setan',
      'Ayam Geprek Keju',
      'Kulit Ayam Krispi',
      'Ayam Goreng Bumbu Kunyit',
      'Ayam Mentega',
      'Ayam Goreng Lengkuas Khas Bandung',
      'Ayam Goreng Kremes',
      'Ayam Bakar Khas Padang',
      'Sop Daging Kambing Bening',
      'Sop Iga Kuah Bumbu Rempah',
      'Coto Makassar',
      'Soto Madura',
      'Soto Ayam Ambengan',
      'Soto Banjarmasin',
      'Sate Daging Sapi Bumbu Santan',
      'Sate Padang',
      'Sate Kambing',
      'Tongseng Daging Sapi',
      'Gulai Daging Sapi Khas Solo',
      'Opor Daging Sapi',
      'Ati Ayam Bumbu Merah',
      'Ati Ampela Bumbu Kecap',
      'Ati Ampela Bumbu Kuning',
      'Ati Ampela Goreng',
      'Ati Ayam Bumbu Balado',
      'Nasi Goreng Spesial Ala Chef Marinka',
      'Nasi Uduk Hijau Sambal Kacang',
      'Nasi Uduk Betawi',
      'Nasi Uduk Aroma Daun Jeruk',
      'Nasi Liwet',
      'Nasi Bukhari Daging Kambing',
      'Nasi Bumbu Rempah Kari',
      'Nasi Goreng Merah',
      'Nasi Goreng Tomat',
      'Nasi Goreng Tabur Telur Dadar',
      'Nasi Goreng India',
      'Nasi Goreng Sukiyaki',
      'Nasi Goreng Kemangi',
      'Nasi Goreng Telur Asin',
      'Nasi Goreng Lada Hitam',
      'Nasi Roll Ayam Jamur',
      'Nasi Kuning',
      'Tumpeng Nasi Kuning',
      'Nasi Lemak Melayu Kukus',
      'Nasi Bakar Ikan Peda',
      'Nasi Bakar Ayam Peda Kemangi',
      'Nasi Bakar Ikan Tuna',
      'Nasi Bakar Cumi',
      'Ketupat Sayur',
      'Nasi Pepes Kukus Sayur',
      'Bubur Ayam Klasik Original',
      'Bubur Manado',
      'Bubur Ayam Ala Resto',
      'Nasi Ulam Khas Betawi',
      'Nasi Tim Ayam Jamur',
      'Sayur Asem Lamtoro',
      'Sayur Asem Jakarta',
      'Sayur Asem Kerupuk Ikan',
      'Sayur Asem Kreasi Ceker Ayam',
      'Sayur Asem Kreasi Kangkung',
      'Sayur Asem Khas Jawa Tengah',
      'Telur Ceplok Kecap',
      'Tempe Krispi Bumbu Ketumbar',
      'Tempe Goreng Lengkuas',
      'Tempe Mendoan Khas Purwokerto',
      'Perkedel Kentang',
      'Perkedel Jagung Ala Manado',
      'Perkedel Tempe Goreng Celup',
      'Perkedel Tempe Campur Jamur',
      'Sayur Lodeh Tewel Sayuran Ala Chef Rudy',
      'Sayur Lodeh Campur Daging',
      'Sayur Bayam Tumis Air',
      'Tumis Sawi Sendok',
      'Tumis Sayur Sawi Hijau Cah Udang',
      'Tumis Kangkung Bumbu Rica-Rica',
      'Tumis Buncis Asam Pedas',
      'Sayur Bening Buncis dan Tahu',
      'Sup Kepiting',
      'Sup Seafood Lemon Kuah',
      'Sup Daging Sapi Bening',
      'Sayur Sop/Sup Sosis Bakso',
      'Tahu Goreng Capcay',
      'Sup Tahu Ayam',
      'Tahu Putih Cabe Garam',
      'Martabak Tahu',
      'Gulai Ikan Mas Tanpa Santan',
      'Ikan Mas Goreng Bumbu Kunyit',
      'Ikan Mas Goreng Tepung',
      'Ikan Mas Bakar',
      'Ikan Mas Bumbu Rica-Rica',
      'Pepes Ikan Mas Bumbu Padang',
      'Ikan Mas Bakar Bumbu Pedas',
      'Ikan Mas Bakar Bumbu Merah',
      'Pecel Lele Goreng Sambal Bawang',
      'Ikan Kakap Saus Tiram',
      'Ikan Gurame Tepung Asam Manis',
      'Ikan Gurame Bakar Kecap Pedas',
      'Pindang Ikan Patin',
      'Udang Goreng Saus Mentega',
      'Udang Saus Asam Manis',
      'Udang Saus Tiram',
      'Udang Balado Campur Pete',
      'Udang Bakar Khas Jimbaran',
      'Udang Goreng Bumbu Rempah',
      'Udang Goreng Tumis Telur Asin dan Kapri',
      'Udang Goreng Tepung Bumbu Rendang',
      'Kepiting Saus Mentega',
      'Kepiting Saus Padang',
      'Kepiting Soka Lada Hitam',
      'Kepiting Soka Goreng Tepung Crispy',
      'Kepiting Saus Tiram',
      'Kepiting Saus Telur Asin',
      'Kepiting Saus Singapore',
      'Kepiting Asam Manis Pedas',
      'Kerang Tahu Masak Saus Tiram',
      'Bakmi Rebus Kuah',
      'Bakmi Medan',
      'Bakmi Padang',
      'Bola-Bola Mi Goreng',
      'Mi Ayam Vegetarian',
      'Mi Ayam Jamur Bakso Spesial',
      'Mi Ayam Bakso Pangsit',
      'Mi Ayam Jamur Merang',
      'Mi Jawa Kuah',
      'Mi Aceh',
      'Mi Celor',
      'Mi Cakalang Goreng',
      'Mi Kangkung Ayam',
      'Mi Tek-Tek Seafood',
      'Mi Tek-Tek Jawa Spesial',
      'Mi Tek-Tek Palembang',
      'Mi Tek-Tek Goreng',
      'Mi Laksa Khas Palembang',
      'Mi Laksa Betawi',
      'Mi Kocok Medan',
      'Mi Kocok Bakso',
      'Omelete Mi Kornet',
      'Kwetiau Kuah',
      'Kwetiau Kuah Telur',
      'Kwetiau Goreng Telur',
      'Kwetiau Goreng Spesial Pedas',
      'Kwetiau Goreng Sapi',
      'Kwetiau Siram Sapi',
      'Kwetiau Ayam Kreasi Madu',
      'Kwetiau Goreng Seafood',
      'Kue Brownies Keju',
      'Kue Brownies Coklat Keju',
      'Kue Brownies Kukus Amanda',
      'Donat Abon',
      'Sate Donat Ubi',
      'Donat Kukus Milo',
      'Donat Sandwich',
      'Uli Bakar Serundeng',
      'Kue Cucur Pandan',
      'Kue Cucur Gula Merah',
      'Kue Bawang Keju',
      'Kue Kastangel Keju',
      'Kue Sagu Keju',
      'Kue Nastar Keju',
      'Kue Kering Kacang Tanah',
      'Kue Kering Lidah Kucing Keju',
      'Kue Putri Salju',
      'Kue Kering Cokelat Keju Mete',
      'Kue Sus Kering',
      'Hot Dog Mini',
      'Roti Sobek',
      'Roti Tawar',
      'Roti Bakar Coklat Keju',
      'Roti Bakar Sosis Keju',
      'Roti Bakar Keju Daging',
      'Blueberry Oreo Mousse',
      'Chocolate Mousse',
      'Avocado Mousse',
      'Pie with Cheese Mousse',
      'Pudding Coklat Kreasi Biskuit Kelapa',
      'Onigiri Tuna',
      'Tempura Udang Jepang',
      'Tempura Jamur Tiram',
      'Tempura Sosis',
      'Tempura Ikan Tenggiri',
      'Tempura Tahu Udang Garing',
      'Tempura Sayur',
      'Tempura Daging Lengkap',
      'Yakiniku Beef',
      'Yakiniku Chicken',
      'Takoyaki',
      'Takoyaki Makaroni',
      'Kue Mochi',
      'Kue Mochi Kacang Hijau Kukus',
      'Karage Ala Jepang',
      'Udon Kuah Ala Jepang',
      'Sashimi Ala Jepang',
      'Sushi Roll',
      'Sushi Roll Goreng',
      'Ayam Teriyaki',
      'Beef Teriyaki',
      'Suimono Ala Jepang',
      'Shabu-Shabu Seafood',
      'Yakitori Ayam Tabur Shicimi',
      'Yakitori Ayam dengan Paprika',
      'Yakitori Seafood',
      'Yakitori Saus Tiram',
      'Yakitori Saus Teriyaki',
      'Beef Yakitori',
      'Okonomiyaki',
      'Wonton Soup',
      'Wonton Goreng Isi Ikan',
      'Pangsit Kuah Gurih',
      'Tahu Mapo',
      'Sapo Tahu Ayam',
      'Koloke Ayam',
      'Bebek Peking Panggang',
      'Ayam Pengemis',
      'Ayam Kung Pao',
      'Ayam Hainan',
      'Bakpao Isi Kacang Merah',
      'Bakpao Ketan Hitam Kukus',
      'Dim Sum Siomay Ikan',
      'Capcay Goreng',
      'Capcay Kuah Sayur',
      'Capcay Kuah Seafood',
      'Capcay Saus Tiram',
      'Capcay Kuah Merah',
      'Capcay Kuah Pedas',
      'Capcay Kuah Bakso',
      'Capcay Printil',
      'Fuyunghai Sayur',
      'Fuyunghai Mie',
      'Fuyunghai Kepiting',
      'Fuyunghai Udang',
      'Fuyunghai Tahu',
      'Fuyunghai Ayam Telur Bebek',
      'Fuyunghai Tepung Terigu',
      'Ifumie Seafood',
      'Bihun/Mihun Goreng Komplit Spesial',
      'Spaghetti',
      'Macaroni Saus Carbonara',
      'Fusilli Panggang',
      'Lasagna Bolognese Panggang',
      'Fettucini Alfredo',
      'Mac Cheese',
      'Spaghetti Saus Tuna',
      'Pizza Barbeque',
      'Pizza Ayam Saus Nanas',
      'Pizza Topping/Tabur Sosis Spesial',
      'Pizza Seafood Spesial',
      'Pizza French Toast',
      'Pizza Mini Sosis',
      'Pizza Keju Mozarella',
      'Chicken Grilled Italian Seasoning',
      'Rolade Daging Ayam Saus Italia',
      'Ravioli Beef dengan Saus Tomat',
      'Ravioli Creamy Mushroom Cheese',
      'Tortellini dengan Saus Krim Jamur',
      'Tortellini Mozarella',
      'Tortellini Isi Ayam Saus Cream',
      'Sup Tortellini Kental',
      'Risotto Ayam Sayuran',
      'Risotto Primavera',
      'Risotto Seafood',
      'Risotto Salmon',
      'Risotto Jamur',
      'Risotto Basic',
      'Risotto Sayuran',
      'Risotto Keju Parmesan'
    ];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (const recipe of recipeArr) {
      const splittedRecipes = recipe.split(' ');

      let typoInsertionRecipeWord = '';
      let typoInsertionRecipeTitle = '';

      for (const splittedRecipe of splittedRecipes) {
        const randomCharFromAlphabet = characters.charAt(Math.random() * characters.length);
        const randomIndex = Math.random() * splittedRecipe.length;
        const toCombineStringA = splittedRecipe.slice(0, randomIndex);
        const toInsertChar = randomCharFromAlphabet;
        const toCombineStringB = splittedRecipe.slice(randomIndex, splittedRecipe.length);
        typoInsertionRecipeWord = toCombineStringA + toInsertChar + toCombineStringB;
        typoInsertionRecipeTitle += typoInsertionRecipeWord + ' ';
      }
      typoInsertionRecipeTitle = typoInsertionRecipeTitle.slice(0, -1);
      console.log('\'' + typoInsertionRecipeTitle + '\',');
    }
  }

  handleTypoGenerationTransposition() {
    const recipeArr = [
      'Rendang Padang Kering',
      'Ayam Rica-Rica Sederhana',
      'Ayam Rica-Rica Kemangi',
      'Ayam Rica-Rica Pedas Manis',
      'Ayam Rica-Rica Khas Manado',
      'Ayam Geprek Sambal Setan',
      'Ayam Geprek Keju',
      'Kulit Ayam Krispi',
      'Ayam Goreng Bumbu Kunyit',
      'Ayam Mentega',
      'Ayam Goreng Lengkuas Khas Bandung',
      'Ayam Goreng Kremes',
      'Ayam Bakar Khas Padang',
      'Sop Daging Kambing Bening',
      'Sop Iga Kuah Bumbu Rempah',
      'Coto Makassar',
      'Soto Madura',
      'Soto Ayam Ambengan',
      'Soto Banjarmasin',
      'Sate Daging Sapi Bumbu Santan',
      'Sate Padang',
      'Sate Kambing',
      'Tongseng Daging Sapi',
      'Gulai Daging Sapi Khas Solo',
      'Opor Daging Sapi',
      'Ati Ayam Bumbu Merah',
      'Ati Ampela Bumbu Kecap',
      'Ati Ampela Bumbu Kuning',
      'Ati Ampela Goreng',
      'Ati Ayam Bumbu Balado',
      'Nasi Goreng Spesial Ala Chef Marinka',
      'Nasi Uduk Hijau Sambal Kacang',
      'Nasi Uduk Betawi',
      'Nasi Uduk Aroma Daun Jeruk',
      'Nasi Liwet',
      'Nasi Bukhari Daging Kambing',
      'Nasi Bumbu Rempah Kari',
      'Nasi Goreng Merah',
      'Nasi Goreng Tomat',
      'Nasi Goreng Tabur Telur Dadar',
      'Nasi Goreng India',
      'Nasi Goreng Sukiyaki',
      'Nasi Goreng Kemangi',
      'Nasi Goreng Telur Asin',
      'Nasi Goreng Lada Hitam',
      'Nasi Roll Ayam Jamur',
      'Nasi Kuning',
      'Tumpeng Nasi Kuning',
      'Nasi Lemak Melayu Kukus',
      'Nasi Bakar Ikan Peda',
      'Nasi Bakar Ayam Peda Kemangi',
      'Nasi Bakar Ikan Tuna',
      'Nasi Bakar Cumi',
      'Ketupat Sayur',
      'Nasi Pepes Kukus Sayur',
      'Bubur Ayam Klasik Original',
      'Bubur Manado',
      'Bubur Ayam Ala Resto',
      'Nasi Ulam Khas Betawi',
      'Nasi Tim Ayam Jamur',
      'Sayur Asem Lamtoro',
      'Sayur Asem Jakarta',
      'Sayur Asem Kerupuk Ikan',
      'Sayur Asem Kreasi Ceker Ayam',
      'Sayur Asem Kreasi Kangkung',
      'Sayur Asem Khas Jawa Tengah',
      'Telur Ceplok Kecap',
      'Tempe Krispi Bumbu Ketumbar',
      'Tempe Goreng Lengkuas',
      'Tempe Mendoan Khas Purwokerto',
      'Perkedel Kentang',
      'Perkedel Jagung Ala Manado',
      'Perkedel Tempe Goreng Celup',
      'Perkedel Tempe Campur Jamur',
      'Sayur Lodeh Tewel Sayuran Ala Chef Rudy',
      'Sayur Lodeh Campur Daging',
      'Sayur Bayam Tumis Air',
      'Tumis Sawi Sendok',
      'Tumis Sayur Sawi Hijau Cah Udang',
      'Tumis Kangkung Bumbu Rica-Rica',
      'Tumis Buncis Asam Pedas',
      'Sayur Bening Buncis dan Tahu',
      'Sup Kepiting',
      'Sup Seafood Lemon Kuah',
      'Sup Daging Sapi Bening',
      'Sayur Sop/Sup Sosis Bakso',
      'Tahu Goreng Capcay',
      'Sup Tahu Ayam',
      'Tahu Putih Cabe Garam',
      'Martabak Tahu',
      'Gulai Ikan Mas Tanpa Santan',
      'Ikan Mas Goreng Bumbu Kunyit',
      'Ikan Mas Goreng Tepung',
      'Ikan Mas Bakar',
      'Ikan Mas Bumbu Rica-Rica',
      'Pepes Ikan Mas Bumbu Padang',
      'Ikan Mas Bakar Bumbu Pedas',
      'Ikan Mas Bakar Bumbu Merah',
      'Pecel Lele Goreng Sambal Bawang',
      'Ikan Kakap Saus Tiram',
      'Ikan Gurame Tepung Asam Manis',
      'Ikan Gurame Bakar Kecap Pedas',
      'Pindang Ikan Patin',
      'Udang Goreng Saus Mentega',
      'Udang Saus Asam Manis',
      'Udang Saus Tiram',
      'Udang Balado Campur Pete',
      'Udang Bakar Khas Jimbaran',
      'Udang Goreng Bumbu Rempah',
      'Udang Goreng Tumis Telur Asin dan Kapri',
      'Udang Goreng Tepung Bumbu Rendang',
      'Kepiting Saus Mentega',
      'Kepiting Saus Padang',
      'Kepiting Soka Lada Hitam',
      'Kepiting Soka Goreng Tepung Crispy',
      'Kepiting Saus Tiram',
      'Kepiting Saus Telur Asin',
      'Kepiting Saus Singapore',
      'Kepiting Asam Manis Pedas',
      'Kerang Tahu Masak Saus Tiram',
      'Bakmi Rebus Kuah',
      'Bakmi Medan',
      'Bakmi Padang',
      'Bola-Bola Mi Goreng',
      'Mi Ayam Vegetarian',
      'Mi Ayam Jamur Bakso Spesial',
      'Mi Ayam Bakso Pangsit',
      'Mi Ayam Jamur Merang',
      'Mi Jawa Kuah',
      'Mi Aceh',
      'Mi Celor',
      'Mi Cakalang Goreng',
      'Mi Kangkung Ayam',
      'Mi Tek-Tek Seafood',
      'Mi Tek-Tek Jawa Spesial',
      'Mi Tek-Tek Palembang',
      'Mi Tek-Tek Goreng',
      'Mi Laksa Khas Palembang',
      'Mi Laksa Betawi',
      'Mi Kocok Medan',
      'Mi Kocok Bakso',
      'Omelete Mi Kornet',
      'Kwetiau Kuah',
      'Kwetiau Kuah Telur',
      'Kwetiau Goreng Telur',
      'Kwetiau Goreng Spesial Pedas',
      'Kwetiau Goreng Sapi',
      'Kwetiau Siram Sapi',
      'Kwetiau Ayam Kreasi Madu',
      'Kwetiau Goreng Seafood',
      'Kue Brownies Keju',
      'Kue Brownies Coklat Keju',
      'Kue Brownies Kukus Amanda',
      'Donat Abon',
      'Sate Donat Ubi',
      'Donat Kukus Milo',
      'Donat Sandwich',
      'Uli Bakar Serundeng',
      'Kue Cucur Pandan',
      'Kue Cucur Gula Merah',
      'Kue Bawang Keju',
      'Kue Kastangel Keju',
      'Kue Sagu Keju',
      'Kue Nastar Keju',
      'Kue Kering Kacang Tanah',
      'Kue Kering Lidah Kucing Keju',
      'Kue Putri Salju',
      'Kue Kering Cokelat Keju Mete',
      'Kue Sus Kering',
      'Hot Dog Mini',
      'Roti Sobek',
      'Roti Tawar',
      'Roti Bakar Coklat Keju',
      'Roti Bakar Sosis Keju',
      'Roti Bakar Keju Daging',
      'Blueberry Oreo Mousse',
      'Chocolate Mousse',
      'Avocado Mousse',
      'Pie with Cheese Mousse',
      'Pudding Coklat Kreasi Biskuit Kelapa',
      'Onigiri Tuna',
      'Tempura Udang Jepang',
      'Tempura Jamur Tiram',
      'Tempura Sosis',
      'Tempura Ikan Tenggiri',
      'Tempura Tahu Udang Garing',
      'Tempura Sayur',
      'Tempura Daging Lengkap',
      'Yakiniku Beef',
      'Yakiniku Chicken',
      'Takoyaki',
      'Takoyaki Makaroni',
      'Kue Mochi',
      'Kue Mochi Kacang Hijau Kukus',
      'Karage Ala Jepang',
      'Udon Kuah Ala Jepang',
      'Sashimi Ala Jepang',
      'Sushi Roll',
      'Sushi Roll Goreng',
      'Ayam Teriyaki',
      'Beef Teriyaki',
      'Suimono Ala Jepang',
      'Shabu-Shabu Seafood',
      'Yakitori Ayam Tabur Shicimi',
      'Yakitori Ayam dengan Paprika',
      'Yakitori Seafood',
      'Yakitori Saus Tiram',
      'Yakitori Saus Teriyaki',
      'Beef Yakitori',
      'Okonomiyaki',
      'Wonton Soup',
      'Wonton Goreng Isi Ikan',
      'Pangsit Kuah Gurih',
      'Tahu Mapo',
      'Sapo Tahu Ayam',
      'Koloke Ayam',
      'Bebek Peking Panggang',
      'Ayam Pengemis',
      'Ayam Kung Pao',
      'Ayam Hainan',
      'Bakpao Isi Kacang Merah',
      'Bakpao Ketan Hitam Kukus',
      'Dim Sum Siomay Ikan',
      'Capcay Goreng',
      'Capcay Kuah Sayur',
      'Capcay Kuah Seafood',
      'Capcay Saus Tiram',
      'Capcay Kuah Merah',
      'Capcay Kuah Pedas',
      'Capcay Kuah Bakso',
      'Capcay Printil',
      'Fuyunghai Sayur',
      'Fuyunghai Mie',
      'Fuyunghai Kepiting',
      'Fuyunghai Udang',
      'Fuyunghai Tahu',
      'Fuyunghai Ayam Telur Bebek',
      'Fuyunghai Tepung Terigu',
      'Ifumie Seafood',
      'Bihun/Mihun Goreng Komplit Spesial',
      'Spaghetti',
      'Macaroni Saus Carbonara',
      'Fusilli Panggang',
      'Lasagna Bolognese Panggang',
      'Fettucini Alfredo',
      'Mac Cheese',
      'Spaghetti Saus Tuna',
      'Pizza Barbeque',
      'Pizza Ayam Saus Nanas',
      'Pizza Topping/Tabur Sosis Spesial',
      'Pizza Seafood Spesial',
      'Pizza French Toast',
      'Pizza Mini Sosis',
      'Pizza Keju Mozarella',
      'Chicken Grilled Italian Seasoning',
      'Rolade Daging Ayam Saus Italia',
      'Ravioli Beef dengan Saus Tomat',
      'Ravioli Creamy Mushroom Cheese',
      'Tortellini dengan Saus Krim Jamur',
      'Tortellini Mozarella',
      'Tortellini Isi Ayam Saus Cream',
      'Sup Tortellini Kental',
      'Risotto Ayam Sayuran',
      'Risotto Primavera',
      'Risotto Seafood',
      'Risotto Salmon',
      'Risotto Jamur',
      'Risotto Basic',
      'Risotto Sayuran',
      'Risotto Keju Parmesan'
    ];

    for (const recipe of recipeArr) {
      const splittedRecipesByWord = recipe.split(' ');

      let typoTranspositionRecipeTitle = '';

      let splittedRecipeArr = [];

      for (const splittedRecipeByWord of splittedRecipesByWord) {
        let typoTranspositionRecipeWord = '';
        splittedRecipeArr = [];
        const splittedRecipesByChar = splittedRecipeByWord.split('');
        for (const splittedRecipeByChar of splittedRecipesByChar) {
          splittedRecipeArr.push(splittedRecipeByChar);
        }
        const firstRandomIndex = Math.floor(Math.random() * splittedRecipesByChar.length);
        let secondRandomIndex = Math.floor(Math.random() * splittedRecipesByChar.length);
        while (splittedRecipeArr[firstRandomIndex].toLowerCase() === splittedRecipeArr[secondRandomIndex].toLowerCase()) {
          secondRandomIndex = Math.floor(Math.random() * splittedRecipesByChar.length);
        }

        [splittedRecipeArr[firstRandomIndex], splittedRecipeArr[secondRandomIndex]] =
          [splittedRecipeArr[secondRandomIndex], splittedRecipeArr[firstRandomIndex]];

        for (const char of splittedRecipeArr) {
          typoTranspositionRecipeWord += char;
        }

        typoTranspositionRecipeTitle += typoTranspositionRecipeWord + ' ';
      }
      typoTranspositionRecipeTitle = typoTranspositionRecipeTitle.slice(0, -1);
      console.log('\'' + typoTranspositionRecipeTitle + '\',');
    }
  }

  handleTypoGenerationSubstitution() {
    const recipeArr = [
      'Rendang Padang Kering',
      'Ayam Rica-Rica Sederhana',
      'Ayam Rica-Rica Kemangi',
      'Ayam Rica-Rica Pedas Manis',
      'Ayam Rica-Rica Khas Manado',
      'Ayam Geprek Sambal Setan',
      'Ayam Geprek Keju',
      'Kulit Ayam Krispi',
      'Ayam Goreng Bumbu Kunyit',
      'Ayam Mentega',
      'Ayam Goreng Lengkuas Khas Bandung',
      'Ayam Goreng Kremes',
      'Ayam Bakar Khas Padang',
      'Sop Daging Kambing Bening',
      'Sop Iga Kuah Bumbu Rempah',
      'Coto Makassar',
      'Soto Madura',
      'Soto Ayam Ambengan',
      'Soto Banjarmasin',
      'Sate Daging Sapi Bumbu Santan',
      'Sate Padang',
      'Sate Kambing',
      'Tongseng Daging Sapi',
      'Gulai Daging Sapi Khas Solo',
      'Opor Daging Sapi',
      'Ati Ayam Bumbu Merah',
      'Ati Ampela Bumbu Kecap',
      'Ati Ampela Bumbu Kuning',
      'Ati Ampela Goreng',
      'Ati Ayam Bumbu Balado',
      'Nasi Goreng Spesial Ala Chef Marinka',
      'Nasi Uduk Hijau Sambal Kacang',
      'Nasi Uduk Betawi',
      'Nasi Uduk Aroma Daun Jeruk',
      'Nasi Liwet',
      'Nasi Bukhari Daging Kambing',
      'Nasi Bumbu Rempah Kari',
      'Nasi Goreng Merah',
      'Nasi Goreng Tomat',
      'Nasi Goreng Tabur Telur Dadar',
      'Nasi Goreng India',
      'Nasi Goreng Sukiyaki',
      'Nasi Goreng Kemangi',
      'Nasi Goreng Telur Asin',
      'Nasi Goreng Lada Hitam',
      'Nasi Roll Ayam Jamur',
      'Nasi Kuning',
      'Tumpeng Nasi Kuning',
      'Nasi Lemak Melayu Kukus',
      'Nasi Bakar Ikan Peda',
      'Nasi Bakar Ayam Peda Kemangi',
      'Nasi Bakar Ikan Tuna',
      'Nasi Bakar Cumi',
      'Ketupat Sayur',
      'Nasi Pepes Kukus Sayur',
      'Bubur Ayam Klasik Original',
      'Bubur Manado',
      'Bubur Ayam Ala Resto',
      'Nasi Ulam Khas Betawi',
      'Nasi Tim Ayam Jamur',
      'Sayur Asem Lamtoro',
      'Sayur Asem Jakarta',
      'Sayur Asem Kerupuk Ikan',
      'Sayur Asem Kreasi Ceker Ayam',
      'Sayur Asem Kreasi Kangkung',
      'Sayur Asem Khas Jawa Tengah',
      'Telur Ceplok Kecap',
      'Tempe Krispi Bumbu Ketumbar',
      'Tempe Goreng Lengkuas',
      'Tempe Mendoan Khas Purwokerto',
      'Perkedel Kentang',
      'Perkedel Jagung Ala Manado',
      'Perkedel Tempe Goreng Celup',
      'Perkedel Tempe Campur Jamur',
      'Sayur Lodeh Tewel Sayuran Ala Chef Rudy',
      'Sayur Lodeh Campur Daging',
      'Sayur Bayam Tumis Air',
      'Tumis Sawi Sendok',
      'Tumis Sayur Sawi Hijau Cah Udang',
      'Tumis Kangkung Bumbu Rica-Rica',
      'Tumis Buncis Asam Pedas',
      'Sayur Bening Buncis dan Tahu',
      'Sup Kepiting',
      'Sup Seafood Lemon Kuah',
      'Sup Daging Sapi Bening',
      'Sayur Sop/Sup Sosis Bakso',
      'Tahu Goreng Capcay',
      'Sup Tahu Ayam',
      'Tahu Putih Cabe Garam',
      'Martabak Tahu',
      'Gulai Ikan Mas Tanpa Santan',
      'Ikan Mas Goreng Bumbu Kunyit',
      'Ikan Mas Goreng Tepung',
      'Ikan Mas Bakar',
      'Ikan Mas Bumbu Rica-Rica',
      'Pepes Ikan Mas Bumbu Padang',
      'Ikan Mas Bakar Bumbu Pedas',
      'Ikan Mas Bakar Bumbu Merah',
      'Pecel Lele Goreng Sambal Bawang',
      'Ikan Kakap Saus Tiram',
      'Ikan Gurame Tepung Asam Manis',
      'Ikan Gurame Bakar Kecap Pedas',
      'Pindang Ikan Patin',
      'Udang Goreng Saus Mentega',
      'Udang Saus Asam Manis',
      'Udang Saus Tiram',
      'Udang Balado Campur Pete',
      'Udang Bakar Khas Jimbaran',
      'Udang Goreng Bumbu Rempah',
      'Udang Goreng Tumis Telur Asin dan Kapri',
      'Udang Goreng Tepung Bumbu Rendang',
      'Kepiting Saus Mentega',
      'Kepiting Saus Padang',
      'Kepiting Soka Lada Hitam',
      'Kepiting Soka Goreng Tepung Crispy',
      'Kepiting Saus Tiram',
      'Kepiting Saus Telur Asin',
      'Kepiting Saus Singapore',
      'Kepiting Asam Manis Pedas',
      'Kerang Tahu Masak Saus Tiram',
      'Bakmi Rebus Kuah',
      'Bakmi Medan',
      'Bakmi Padang',
      'Bola-Bola Mi Goreng',
      'Mi Ayam Vegetarian',
      'Mi Ayam Jamur Bakso Spesial',
      'Mi Ayam Bakso Pangsit',
      'Mi Ayam Jamur Merang',
      'Mi Jawa Kuah',
      'Mi Aceh',
      'Mi Celor',
      'Mi Cakalang Goreng',
      'Mi Kangkung Ayam',
      'Mi Tek-Tek Seafood',
      'Mi Tek-Tek Jawa Spesial',
      'Mi Tek-Tek Palembang',
      'Mi Tek-Tek Goreng',
      'Mi Laksa Khas Palembang',
      'Mi Laksa Betawi',
      'Mi Kocok Medan',
      'Mi Kocok Bakso',
      'Omelete Mi Kornet',
      'Kwetiau Kuah',
      'Kwetiau Kuah Telur',
      'Kwetiau Goreng Telur',
      'Kwetiau Goreng Spesial Pedas',
      'Kwetiau Goreng Sapi',
      'Kwetiau Siram Sapi',
      'Kwetiau Ayam Kreasi Madu',
      'Kwetiau Goreng Seafood',
      'Kue Brownies Keju',
      'Kue Brownies Coklat Keju',
      'Kue Brownies Kukus Amanda',
      'Donat Abon',
      'Sate Donat Ubi',
      'Donat Kukus Milo',
      'Donat Sandwich',
      'Uli Bakar Serundeng',
      'Kue Cucur Pandan',
      'Kue Cucur Gula Merah',
      'Kue Bawang Keju',
      'Kue Kastangel Keju',
      'Kue Sagu Keju',
      'Kue Nastar Keju',
      'Kue Kering Kacang Tanah',
      'Kue Kering Lidah Kucing Keju',
      'Kue Putri Salju',
      'Kue Kering Cokelat Keju Mete',
      'Kue Sus Kering',
      'Hot Dog Mini',
      'Roti Sobek',
      'Roti Tawar',
      'Roti Bakar Coklat Keju',
      'Roti Bakar Sosis Keju',
      'Roti Bakar Keju Daging',
      'Blueberry Oreo Mousse',
      'Chocolate Mousse',
      'Avocado Mousse',
      'Pie with Cheese Mousse',
      'Pudding Coklat Kreasi Biskuit Kelapa',
      'Onigiri Tuna',
      'Tempura Udang Jepang',
      'Tempura Jamur Tiram',
      'Tempura Sosis',
      'Tempura Ikan Tenggiri',
      'Tempura Tahu Udang Garing',
      'Tempura Sayur',
      'Tempura Daging Lengkap',
      'Yakiniku Beef',
      'Yakiniku Chicken',
      'Takoyaki',
      'Takoyaki Makaroni',
      'Kue Mochi',
      'Kue Mochi Kacang Hijau Kukus',
      'Karage Ala Jepang',
      'Udon Kuah Ala Jepang',
      'Sashimi Ala Jepang',
      'Sushi Roll',
      'Sushi Roll Goreng',
      'Ayam Teriyaki',
      'Beef Teriyaki',
      'Suimono Ala Jepang',
      'Shabu-Shabu Seafood',
      'Yakitori Ayam Tabur Shicimi',
      'Yakitori Ayam dengan Paprika',
      'Yakitori Seafood',
      'Yakitori Saus Tiram',
      'Yakitori Saus Teriyaki',
      'Beef Yakitori',
      'Okonomiyaki',
      'Wonton Soup',
      'Wonton Goreng Isi Ikan',
      'Pangsit Kuah Gurih',
      'Tahu Mapo',
      'Sapo Tahu Ayam',
      'Koloke Ayam',
      'Bebek Peking Panggang',
      'Ayam Pengemis',
      'Ayam Kung Pao',
      'Ayam Hainan',
      'Bakpao Isi Kacang Merah',
      'Bakpao Ketan Hitam Kukus',
      'Dim Sum Siomay Ikan',
      'Capcay Goreng',
      'Capcay Kuah Sayur',
      'Capcay Kuah Seafood',
      'Capcay Saus Tiram',
      'Capcay Kuah Merah',
      'Capcay Kuah Pedas',
      'Capcay Kuah Bakso',
      'Capcay Printil',
      'Fuyunghai Sayur',
      'Fuyunghai Mie',
      'Fuyunghai Kepiting',
      'Fuyunghai Udang',
      'Fuyunghai Tahu',
      'Fuyunghai Ayam Telur Bebek',
      'Fuyunghai Tepung Terigu',
      'Ifumie Seafood',
      'Bihun/Mihun Goreng Komplit Spesial',
      'Spaghetti',
      'Macaroni Saus Carbonara',
      'Fusilli Panggang',
      'Lasagna Bolognese Panggang',
      'Fettucini Alfredo',
      'Mac Cheese',
      'Spaghetti Saus Tuna',
      'Pizza Barbeque',
      'Pizza Ayam Saus Nanas',
      'Pizza Topping/Tabur Sosis Spesial',
      'Pizza Seafood Spesial',
      'Pizza French Toast',
      'Pizza Mini Sosis',
      'Pizza Keju Mozarella',
      'Chicken Grilled Italian Seasoning',
      'Rolade Daging Ayam Saus Italia',
      'Ravioli Beef dengan Saus Tomat',
      'Ravioli Creamy Mushroom Cheese',
      'Tortellini dengan Saus Krim Jamur',
      'Tortellini Mozarella',
      'Tortellini Isi Ayam Saus Cream',
      'Sup Tortellini Kental',
      'Risotto Ayam Sayuran',
      'Risotto Primavera',
      'Risotto Seafood',
      'Risotto Salmon',
      'Risotto Jamur',
      'Risotto Basic',
      'Risotto Sayuran',
      'Risotto Keju Parmesan'
    ];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (const recipe of recipeArr) {
      const splittedRecipes = recipe.split(' ');

      let typoSubstitutionRecipeWord = '';
      let typoSubstitutionRecipeTitle = '';

      for (const splittedRecipe of splittedRecipes) {
        const randomCharFromRecipe = splittedRecipe.charAt(Math.random() * splittedRecipe.length);
        let randomCharFromAlphabet = characters.charAt(Math.random() * characters.length);

        while (randomCharFromRecipe.toLowerCase() === randomCharFromAlphabet.toLowerCase()) {
          randomCharFromAlphabet = characters.charAt(Math.random() * characters.length);
        }

        typoSubstitutionRecipeWord = splittedRecipe.replace(randomCharFromRecipe, randomCharFromAlphabet);

        typoSubstitutionRecipeTitle += typoSubstitutionRecipeWord + ' ';
      }
      typoSubstitutionRecipeTitle = typoSubstitutionRecipeTitle.slice(0, -1);
      console.log('\'' + typoSubstitutionRecipeTitle + '\',');
    }
  }

  substitutionTypoGen(splittedRecipe) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let typoSubstitutionRecipeWord = '';

    const randomCharFromRecipe = splittedRecipe.charAt(Math.random() * splittedRecipe.length);
    let randomCharFromAlphabet = characters.charAt(Math.random() * characters.length);

    while (randomCharFromRecipe.toLowerCase() === randomCharFromAlphabet.toLowerCase()) {
      randomCharFromAlphabet = characters.charAt(Math.random() * characters.length);
    }

    typoSubstitutionRecipeWord = splittedRecipe.replace(randomCharFromRecipe, randomCharFromAlphabet);

    return typoSubstitutionRecipeWord;
  }

  transpositionTypoGen(splittedRecipe) {
    const splittedRecipeByWord = splittedRecipe;

    let splittedRecipeArr: any[];

    let typoTranspositionRecipeWord = '';
    splittedRecipeArr = [];
    const splittedRecipesByChar = splittedRecipeByWord.split('');
    for (const splittedRecipeByChar of splittedRecipesByChar) {
      splittedRecipeArr.push(splittedRecipeByChar);
    }
    const firstRandomIndex = Math.floor(Math.random() * splittedRecipesByChar.length);
    let secondRandomIndex = Math.floor(Math.random() * splittedRecipesByChar.length);
    while (splittedRecipeArr[firstRandomIndex].toLowerCase() === splittedRecipeArr[secondRandomIndex].toLowerCase()) {
      secondRandomIndex = Math.floor(Math.random() * splittedRecipesByChar.length);
    }

    [splittedRecipeArr[firstRandomIndex], splittedRecipeArr[secondRandomIndex]] =
      [splittedRecipeArr[secondRandomIndex], splittedRecipeArr[firstRandomIndex]];

    for (const char of splittedRecipeArr) {
      typoTranspositionRecipeWord += char;
    }

    return typoTranspositionRecipeWord;
  }

  insertionTypoGen(splittedRecipe) {
    let typoInsertionRecipeWord = '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const randomCharFromAlphabet = characters.charAt(Math.random() * characters.length);
    const randomIndex = Math.random() * splittedRecipe.length;
    const toCombineStringA = splittedRecipe.slice(0, randomIndex);
    const toInsertChar = randomCharFromAlphabet;
    const toCombineStringB = splittedRecipe.slice(randomIndex, splittedRecipe.length);
    typoInsertionRecipeWord = toCombineStringA + toInsertChar + toCombineStringB;

    return typoInsertionRecipeWord;
  }

  deletionTypoGen(splittedRecipe) {
    let typoDeletionRecipeWord = '';

    const randomCharFromSplittedRecipe = splittedRecipe.charAt(Math.random() * splittedRecipe.length);
    const emptyString = '';
    typoDeletionRecipeWord = splittedRecipe.replace(randomCharFromSplittedRecipe, emptyString);

    return typoDeletionRecipeWord;
  }

  handleTypoGenerationCombination() {
    const recipeArr = [
      'Rendang Padang Kering',
      'Ayam Rica-Rica Sederhana',
      'Ayam Rica-Rica Kemangi',
      'Ayam Rica-Rica Pedas Manis',
      'Ayam Rica-Rica Khas Manado',
      'Ayam Geprek Sambal Setan',
      'Ayam Geprek Keju',
      'Kulit Ayam Krispi',
      'Ayam Goreng Bumbu Kunyit',
      'Ayam Mentega',
      'Ayam Goreng Lengkuas Khas Bandung',
      'Ayam Goreng Kremes',
      'Ayam Bakar Khas Padang',
      'Sop Daging Kambing Bening',
      'Sop Iga Kuah Bumbu Rempah',
      'Coto Makassar',
      'Soto Madura',
      'Soto Ayam Ambengan',
      'Soto Banjarmasin',
      'Sate Daging Sapi Bumbu Santan',
      'Sate Padang',
      'Sate Kambing',
      'Tongseng Daging Sapi',
      'Gulai Daging Sapi Khas Solo',
      'Opor Daging Sapi',
      'Ati Ayam Bumbu Merah',
      'Ati Ampela Bumbu Kecap',
      'Ati Ampela Bumbu Kuning',
      'Ati Ampela Goreng',
      'Ati Ayam Bumbu Balado',
      'Nasi Goreng Spesial Ala Chef Marinka',
      'Nasi Uduk Hijau Sambal Kacang',
      'Nasi Uduk Betawi',
      'Nasi Uduk Aroma Daun Jeruk',
      'Nasi Liwet',
      'Nasi Bukhari Daging Kambing',
      'Nasi Bumbu Rempah Kari',
      'Nasi Goreng Merah',
      'Nasi Goreng Tomat',
      'Nasi Goreng Tabur Telur Dadar',
      'Nasi Goreng India',
      'Nasi Goreng Sukiyaki',
      'Nasi Goreng Kemangi',
      'Nasi Goreng Telur Asin',
      'Nasi Goreng Lada Hitam',
      'Nasi Roll Ayam Jamur',
      'Nasi Kuning',
      'Tumpeng Nasi Kuning',
      'Nasi Lemak Melayu Kukus',
      'Nasi Bakar Ikan Peda',
      'Nasi Bakar Ayam Peda Kemangi',
      'Nasi Bakar Ikan Tuna',
      'Nasi Bakar Cumi',
      'Ketupat Sayur',
      'Nasi Pepes Kukus Sayur',
      'Bubur Ayam Klasik Original',
      'Bubur Manado',
      'Bubur Ayam Ala Resto',
      'Nasi Ulam Khas Betawi',
      'Nasi Tim Ayam Jamur',
      'Sayur Asem Lamtoro',
      'Sayur Asem Jakarta',
      'Sayur Asem Kerupuk Ikan',
      'Sayur Asem Kreasi Ceker Ayam',
      'Sayur Asem Kreasi Kangkung',
      'Sayur Asem Khas Jawa Tengah',
      'Telur Ceplok Kecap',
      'Tempe Krispi Bumbu Ketumbar',
      'Tempe Goreng Lengkuas',
      'Tempe Mendoan Khas Purwokerto',
      'Perkedel Kentang',
      'Perkedel Jagung Ala Manado',
      'Perkedel Tempe Goreng Celup',
      'Perkedel Tempe Campur Jamur',
      'Sayur Lodeh Tewel Sayuran Ala Chef Rudy',
      'Sayur Lodeh Campur Daging',
      'Sayur Bayam Tumis Air',
      'Tumis Sawi Sendok',
      'Tumis Sayur Sawi Hijau Cah Udang',
      'Tumis Kangkung Bumbu Rica-Rica',
      'Tumis Buncis Asam Pedas',
      'Sayur Bening Buncis dan Tahu',
      'Sup Kepiting',
      'Sup Seafood Lemon Kuah',
      'Sup Daging Sapi Bening',
      'Sayur Sop/Sup Sosis Bakso',
      'Tahu Goreng Capcay',
      'Sup Tahu Ayam',
      'Tahu Putih Cabe Garam',
      'Martabak Tahu',
      'Gulai Ikan Mas Tanpa Santan',
      'Ikan Mas Goreng Bumbu Kunyit',
      'Ikan Mas Goreng Tepung',
      'Ikan Mas Bakar',
      'Ikan Mas Bumbu Rica-Rica',
      'Pepes Ikan Mas Bumbu Padang',
      'Ikan Mas Bakar Bumbu Pedas',
      'Ikan Mas Bakar Bumbu Merah',
      'Pecel Lele Goreng Sambal Bawang',
      'Ikan Kakap Saus Tiram',
      'Ikan Gurame Tepung Asam Manis',
      'Ikan Gurame Bakar Kecap Pedas',
      'Pindang Ikan Patin',
      'Udang Goreng Saus Mentega',
      'Udang Saus Asam Manis',
      'Udang Saus Tiram',
      'Udang Balado Campur Pete',
      'Udang Bakar Khas Jimbaran',
      'Udang Goreng Bumbu Rempah',
      'Udang Goreng Tumis Telur Asin dan Kapri',
      'Udang Goreng Tepung Bumbu Rendang',
      'Kepiting Saus Mentega',
      'Kepiting Saus Padang',
      'Kepiting Soka Lada Hitam',
      'Kepiting Soka Goreng Tepung Crispy',
      'Kepiting Saus Tiram',
      'Kepiting Saus Telur Asin',
      'Kepiting Saus Singapore',
      'Kepiting Asam Manis Pedas',
      'Kerang Tahu Masak Saus Tiram',
      'Bakmi Rebus Kuah',
      'Bakmi Medan',
      'Bakmi Padang',
      'Bola-Bola Mi Goreng',
      'Mi Ayam Vegetarian',
      'Mi Ayam Jamur Bakso Spesial',
      'Mi Ayam Bakso Pangsit',
      'Mi Ayam Jamur Merang',
      'Mi Jawa Kuah',
      'Mi Aceh',
      'Mi Celor',
      'Mi Cakalang Goreng',
      'Mi Kangkung Ayam',
      'Mi Tek-Tek Seafood',
      'Mi Tek-Tek Jawa Spesial',
      'Mi Tek-Tek Palembang',
      'Mi Tek-Tek Goreng',
      'Mi Laksa Khas Palembang',
      'Mi Laksa Betawi',
      'Mi Kocok Medan',
      'Mi Kocok Bakso',
      'Omelete Mi Kornet',
      'Kwetiau Kuah',
      'Kwetiau Kuah Telur',
      'Kwetiau Goreng Telur',
      'Kwetiau Goreng Spesial Pedas',
      'Kwetiau Goreng Sapi',
      'Kwetiau Siram Sapi',
      'Kwetiau Ayam Kreasi Madu',
      'Kwetiau Goreng Seafood',
      'Kue Brownies Keju',
      'Kue Brownies Coklat Keju',
      'Kue Brownies Kukus Amanda',
      'Donat Abon',
      'Sate Donat Ubi',
      'Donat Kukus Milo',
      'Donat Sandwich',
      'Uli Bakar Serundeng',
      'Kue Cucur Pandan',
      'Kue Cucur Gula Merah',
      'Kue Bawang Keju',
      'Kue Kastangel Keju',
      'Kue Sagu Keju',
      'Kue Nastar Keju',
      'Kue Kering Kacang Tanah',
      'Kue Kering Lidah Kucing Keju',
      'Kue Putri Salju',
      'Kue Kering Cokelat Keju Mete',
      'Kue Sus Kering',
      'Hot Dog Mini',
      'Roti Sobek',
      'Roti Tawar',
      'Roti Bakar Coklat Keju',
      'Roti Bakar Sosis Keju',
      'Roti Bakar Keju Daging',
      'Blueberry Oreo Mousse',
      'Chocolate Mousse',
      'Avocado Mousse',
      'Pie with Cheese Mousse',
      'Pudding Coklat Kreasi Biskuit Kelapa',
      'Onigiri Tuna',
      'Tempura Udang Jepang',
      'Tempura Jamur Tiram',
      'Tempura Sosis',
      'Tempura Ikan Tenggiri',
      'Tempura Tahu Udang Garing',
      'Tempura Sayur',
      'Tempura Daging Lengkap',
      'Yakiniku Beef',
      'Yakiniku Chicken',
      'Takoyaki',
      'Takoyaki Makaroni',
      'Kue Mochi',
      'Kue Mochi Kacang Hijau Kukus',
      'Karage Ala Jepang',
      'Udon Kuah Ala Jepang',
      'Sashimi Ala Jepang',
      'Sushi Roll',
      'Sushi Roll Goreng',
      'Ayam Teriyaki',
      'Beef Teriyaki',
      'Suimono Ala Jepang',
      'Shabu-Shabu Seafood',
      'Yakitori Ayam Tabur Shicimi',
      'Yakitori Ayam dengan Paprika',
      'Yakitori Seafood',
      'Yakitori Saus Tiram',
      'Yakitori Saus Teriyaki',
      'Beef Yakitori',
      'Okonomiyaki',
      'Wonton Soup',
      'Wonton Goreng Isi Ikan',
      'Pangsit Kuah Gurih',
      'Tahu Mapo',
      'Sapo Tahu Ayam',
      'Koloke Ayam',
      'Bebek Peking Panggang',
      'Ayam Pengemis',
      'Ayam Kung Pao',
      'Ayam Hainan',
      'Bakpao Isi Kacang Merah',
      'Bakpao Ketan Hitam Kukus',
      'Dim Sum Siomay Ikan',
      'Capcay Goreng',
      'Capcay Kuah Sayur',
      'Capcay Kuah Seafood',
      'Capcay Saus Tiram',
      'Capcay Kuah Merah',
      'Capcay Kuah Pedas',
      'Capcay Kuah Bakso',
      'Capcay Printil',
      'Fuyunghai Sayur',
      'Fuyunghai Mie',
      'Fuyunghai Kepiting',
      'Fuyunghai Udang',
      'Fuyunghai Tahu',
      'Fuyunghai Ayam Telur Bebek',
      'Fuyunghai Tepung Terigu',
      'Ifumie Seafood',
      'Bihun/Mihun Goreng Komplit Spesial',
      'Spaghetti',
      'Macaroni Saus Carbonara',
      'Fusilli Panggang',
      'Lasagna Bolognese Panggang',
      'Fettucini Alfredo',
      'Mac Cheese',
      'Spaghetti Saus Tuna',
      'Pizza Barbeque',
      'Pizza Ayam Saus Nanas',
      'Pizza Topping/Tabur Sosis Spesial',
      'Pizza Seafood Spesial',
      'Pizza French Toast',
      'Pizza Mini Sosis',
      'Pizza Keju Mozarella',
      'Chicken Grilled Italian Seasoning',
      'Rolade Daging Ayam Saus Italia',
      'Ravioli Beef dengan Saus Tomat',
      'Ravioli Creamy Mushroom Cheese',
      'Tortellini dengan Saus Krim Jamur',
      'Tortellini Mozarella',
      'Tortellini Isi Ayam Saus Cream',
      'Sup Tortellini Kental',
      'Risotto Ayam Sayuran',
      'Risotto Primavera',
      'Risotto Seafood',
      'Risotto Salmon',
      'Risotto Jamur',
      'Risotto Basic',
      'Risotto Sayuran',
      'Risotto Keju Parmesan'
    ];
    let isTypoSubstitutionDone = false;
    let isTypoTranspositionDone = false;
    let isTypoInsertionDone = false;
    let isTypoDeletionDone = false;
    let doRandom = true;
    let randMark = 0;
    let typoResultTitle = '';

    for (const recipe of recipeArr) {
      const splittedRecipes = recipe.split(' ');
      typoResultTitle = '';
      for (const splittedRecipe of splittedRecipes) {
        if (isTypoSubstitutionDone && isTypoTranspositionDone && isTypoInsertionDone && isTypoDeletionDone) {
          isTypoSubstitutionDone = false;
          isTypoTranspositionDone = false;
          isTypoInsertionDone = false;
          isTypoDeletionDone = false;
        }

        doRandom = true;

        while (doRandom) {
          randMark = Math.floor(Math.random() * 4);

          if (randMark === 0 && !isTypoSubstitutionDone) {
            typoResultTitle += this.substitutionTypoGen(splittedRecipe) + ' ';
            isTypoSubstitutionDone = true;
            doRandom = false;
          } else if (randMark === 1 && !isTypoTranspositionDone) {
            typoResultTitle += this.transpositionTypoGen(splittedRecipe) + ' ';
            isTypoTranspositionDone = true;
            doRandom = false;
          } else if (randMark === 2 && !isTypoInsertionDone) {
            typoResultTitle += this.insertionTypoGen(splittedRecipe) + ' ';
            isTypoInsertionDone = true;
            doRandom = false;
          } else if (randMark === 3 && !isTypoDeletionDone) {
            typoResultTitle += this.deletionTypoGen(splittedRecipe) + ' ';
            isTypoDeletionDone = true;
            doRandom = false;
          }
        }
      }
      typoResultTitle = typoResultTitle.slice(0, -1);
      console.log('\'' + typoResultTitle + '\',');
    }
  }

  handleTestTypo() {
    for (const typoRecipe of this.typoRecipes) {
      const firstString = typoRecipe.toLowerCase();
      const firstStringLen = firstString.length;
      const highestScoreRecipes: HighestScoreRecipe[] = [];
      // let topRecipe: HighestScoreRecipe[] = '';
      for (const recipe of this.toTestRecipes) {
        let jaroWinklerDistance = 0;
        // const testSecondString = 'johnson';
        // const secondString = testSecondString.toLowerCase();
        const secondString = recipe.toLowerCase();
        const secondStringLen = secondString.length;

        const firstStringMatches = [];
        const secondStringMatches = [];

        const maxMatchDistance = Math.floor(secondStringLen / 2) - 1;
        let matches = 0;

        for (let i = 0; i < firstStringLen; i++) {
          const start = Math.max(0, i - maxMatchDistance);
          const end = Math.min(i + maxMatchDistance + 1, secondStringLen);

          for (let j = start; j < end; j++) {
            if (secondStringMatches[j]) {
              continue;
            }
            if (firstString[i] !== secondString[j]) {
              continue;
            }
            firstStringMatches[i] = true;
            secondStringMatches[j] = true;
            matches++;
            break;
          }
        }

        let k = 0;
        let transpositions = 0;
        for (let a = 0; a < firstStringLen; a++) {
          // // if there are no matches in str1 continue
          if (!firstStringMatches[a]) {
            continue;
          }
          // // while there is no match in str2 increment k
          while (!secondStringMatches[k]) {
            k++;
          }
          // // increment transpositions
          if (firstString[a] !== secondString[k]) {
            transpositions++;
          }
          k++;
        }

        transpositions = Math.ceil(transpositions / 2);

        let jaroDistance = 0;

        jaroDistance = ((matches / firstStringLen) + (matches / secondStringLen) + ((matches - transpositions) / matches)) / 3.0;

        let totalPrefix = 0;
        for (let i = 0; i < 4; i++) {
          if (firstString[i] === secondString[i]) {
            totalPrefix++;
          } else {
            break;
          }
        }

        jaroWinklerDistance = jaroDistance + (totalPrefix * 0.1 * (1 - jaroDistance));

        if (jaroWinklerDistance >= 0.7) {
          highestScoreRecipes.push({
            title: secondString,
            value: jaroWinklerDistance
          });
        } else {
          highestScoreRecipes.push({
            title: 'di bawah 0.7: ' + secondString,
            value: jaroWinklerDistance
          });
        }
        highestScoreRecipes.sort((a, b) => b.value - a.value);
      }
      // highestScoreRecipes.sort((a, b) =>
      //   (a.value < b.value) ? 1 : -1);
      // console.log(highestScoreRecipes[0].value);
      // console.log(highestScoreRecipes[0].title);
      console.log(highestScoreRecipes[0].value.toFixed(5));
    }

    // this.recipeService.getMostSimilarRecipes(highestScoreRecipes);
    // this.mostSimilarRecipes = this.recipeService.mostSimilarRecipes.sort((a, b) =>
    //   (a.jaroWinklerDistance < b.jaroWinklerDistance) ? 1 : -1);
    // for (const mostSimilarRecipes of this.mostSimilarRecipes) {
    //   console.log(mostSimilarRecipes.jaroWinklerDistance);
    // }
  }

  handleInput(event) {
    this.searchQuery = event.target.value.toLowerCase();
    const recipeList = Array.from(document.getElementById('searchRecipeList').children);
    let falseCount = 0;
    requestAnimationFrame(async () => {
      for (const recipe of recipeList) {
        const shouldShow = recipe.textContent.toLowerCase().indexOf(this.searchQuery) > -1;
        // @ts-ignore
        recipe.style.display = shouldShow ? 'block' : 'none';
        if (shouldShow === false) {
          falseCount++;
        }
        if (falseCount === recipeList.length) {
          document.getElementById('list-none').style.display = 'block';
          this.calculateJaroWinklerDistance(this.searchQuery);
        } else {
          document.getElementById('list-none').style.display = 'none';
        }
      }
    });

    if (this.searchQuery.length > 0) {
      document.getElementById('list-recipe-type').style.display = 'block';
    } else {
      document.getElementById('list-recipe-type').style.display = 'none';
    }
  }

  calculateJaroWinklerDistance(searchQuery) {
    const highestScoreRecipes: HighestScoreRecipe[] = [];
    const firstString = searchQuery.toLowerCase();
    const firstStringLen = firstString.length;

    for (const recipe of this.forSearchRecipes) {
      let jaroWinklerDistance = 0;
      // const testSecondString = 'kue putri salju';
      // const secondString = testSecondString.toLowerCase();
      const secondString = recipe.title.toLowerCase();
      const secondStringLen = secondString.length;

      const firstStringMatches = [];
      const secondStringMatches = [];

      const maxMatchDistance = Math.floor(secondStringLen / 2) - 1;
      // const maxMatchDistance = secondStringLen;
      let matches = 0;

      for (let i = 0; i < firstStringLen; i++) {
        const start = Math.max(0, i - maxMatchDistance);
        const end = Math.min(i + maxMatchDistance + 1, secondStringLen);

        for (let j = start; j < end; j++) {
          if (secondStringMatches[j]) {
            continue;
          }
          if (firstString[i] !== secondString[j]) {
            continue;
          }
          firstStringMatches[i] = true;
          secondStringMatches[j] = true;
          matches++;
          break;
        }
      }

      let k = 0;
      let transpositions = 0;
      for (let a = 0; a < firstStringLen; a++) {
        // // if there are no matches in str1 continue
        if (!firstStringMatches[a]) {
          continue;
        }
        // // while there is no match in str2 increment k
        while (!secondStringMatches[k]) {
          k++;
        }
        // // increment transpositions
        if (firstString[a] !== secondString[k]) {
          transpositions++;
        }
        k++;
      }

      // for (let x = 0; x < firstStringLen; x++) {
      // console.log('firstStringMatches[' + x + '] = ' + firstString[x] + ' ' + firstStringMatches[x]);
      // console.log('secondStringMatches[' + x + '] = ' + secondString[x] + ' ' + secondStringMatches[x]);
      // const start = Math.max(0, x - maxMatchDistance);
      // const end = Math.min(x + maxMatchDistance + 1, secondStringLen);
      //
      // for (let j = start; j < end; j++) {
      //   if (secondStringMatches[j]) {
      //     continue;
      //   }
      //   if (firstString[x] !== secondString[j]) {
      //     continue;
      //   }
      //   firstStringMatches[x] = true;
      //   secondStringMatches[j] = true;
      //   matches++;
      //   break;
      // }
      // }

      transpositions = Math.ceil(transpositions / 2);

      let jaroDistance = 0;

      jaroDistance = ((matches / firstStringLen) + (matches / secondStringLen) + ((matches - transpositions) / matches)) / 3.0;

      let totalPrefix = 0;
      for (let i = 0; i < 4; i++) {
        if (firstString[i] === secondString[i]) {
          totalPrefix++;
        } else {
          break;
        }
      }

      jaroWinklerDistance = jaroDistance + (totalPrefix * 0.1 * (1 - jaroDistance));

      // console.log('firstStringLen: ', firstStringLen);
      // console.log('secondStringLen: ', secondStringLen);
      // console.log('maxMatchDistance: ', maxMatchDistance);
      // console.log('matches: ', matches);
      // console.log('transpositions: ', transpositions);
      // console.log('jaroDistance: ', jaroDistance);
      // console.log('totalPrefix: ', totalPrefix);
      // console.log('jaroWinklerDistance: ', jaroWinklerDistance);

      if (jaroWinklerDistance >= 0.7) {
        highestScoreRecipes.push({
          title: secondString,
          value: jaroWinklerDistance
        });
      }
    }
    this.recipeService.getMostSimilarRecipes(highestScoreRecipes);
    this.mostSimilarRecipes = this.recipeService.mostSimilarRecipes.sort((a, b) =>
      (a.jaroWinklerDistance < b.jaroWinklerDistance) ? 1 : -1);
    this.mostSimilarRecipes = this.mostSimilarRecipes.slice(0, 5);
    console.log('mostSimilarRecipes: ', this.mostSimilarRecipes[0].jaroWinklerDistance);
  }

  handleFocus() {
    this.isSearchFocus = true;
    document.getElementById('grid-menu').style.display = 'none';
  }

  handleCancel() {
    this.isSearchFocus = false;
    document.getElementById('grid-menu').style.display = 'block';
  }

  getRecipeTypeDisplay() {
    switch (this.recipeType) {
      case 'daging':
        this.recipeTypeDisplay = 'Daging';
        break;
      case 'nasi':
        this.recipeTypeDisplay = 'Nasi';
        break;
      case 'vegetarian':
        this.recipeTypeDisplay = 'Vegetarian';
        break;
      case 'ikanSeafood':
        this.recipeTypeDisplay = 'Ikan/Seafood';
        break;
      case 'mi':
        this.recipeTypeDisplay = 'Mi';
        break;
      case 'kue':
        this.recipeTypeDisplay = 'Kue';
        break;
      case 'masakanJepang':
        this.recipeTypeDisplay = 'Masakan Jepang';
        break;
      case 'masakanTiongkok':
        this.recipeTypeDisplay = 'Masakan Tiongkok';
        break;
      case 'masakanItalia':
        this.recipeTypeDisplay = 'Masakan Italia';
        break;
      default:
        this.recipeTypeDisplay = 'kosong';
    }
  }

  handleHistoryChange(id, recipeTitle, recipeType, recipeImageUrl) {
    this.recipeType = recipeType;
    this.getRecipeTypeDisplay();
    this.storageService.updateHistory(id, recipeTitle, this.recipeTypeDisplay, recipeImageUrl);
  }
}
