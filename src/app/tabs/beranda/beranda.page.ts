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

  // typoRecipes = ['ReynDQdoang Pamdang KeriHnng',
  //   'AQUoyam zcRica-RLica SedderPhana',
  //   'jAyCam RicUa-RiocaDs yKemangi',
  //   'AyamT Riecia-Rica PedtasC lYMalnis',
  //   'AyamSbX RiecaQ-Rica Khas MDanadPMo',
  //   'AyamdLr Geprek aSamWEbalKn Setan',
  //   'Ayvtam VGepraaek Keju',
  //   'VKuliwt BAyamG Krijspi',
  //   'AIyam GoTrenYg Bumbuanyn KJunyit',
  //   'AyAam xiMdentega',
  //   'AJyGamr Gjoreng LetEngqkuHasT Kahals Bandung',
  //   'Ayam GGorctengMO Kremess',
  //   'CiAyam BaTkazrJ KhNas PadaPng',
  //   'Sop DDfagindg KamIbingU BefMniung',
  //   'oSoOp IJga OKuah Bcumbku RemuTpah',
  //   'CosBBto MakasVsar',
  //   'XSootto Madura',
  //   'SotSol Adyam gGAmbengaJn',
  //   'PSoyDto FBanHjarmasin',
  //   'SSate DaCgingX wSapji BumbuJ SaoWntaWn',
  //   'Satdveo Padang',
  //   'sSate KiambkZing',
  //   'TvongsoenUgw Dagingx fSapi',
  //   'GujlaiQ DagingL LSapVi Khhgas dSoOlo',
  //   'OpoUr xDaginPlgU Sapi',
  //   'AtKi AyaDmA bBumbbu eMerah',
  //   'AtTi AmKpela bRDBumvbuX Kecap',
  //   'RAti AmpeFRIlaK BuQKmbu Kuning',
  //   'sAti Asmpela KGorenuug',
  //   'AutJi AymKarm Bumbu jBalTado',
  //   'Nasi GSorengqI cSfpesiaal HYAflea ChewfJ Marinka',
  //   'Nasi UduSWkL Hijanuh SmaBmbal oKaGcang',
  //   'NNmasi Uduk lBecvtawi',
  //   'Naslmi UdquPFk Arogma DYaun JFeruk',
  //   'Njasi Lliwoet',
  //   'Nasi CBuIkhaWrhi DagingN QNKaHmbiUng',
  //   'Nasi iBumbu RNeompabIh VKaHri',
  //   'Nasix GorenEg jxsMerah',
  //   'IzNasi GoruengP ToEmat',
  //   'NaArsi YrGoUpreng jTaPbEur Telur Dadar',
  //   'bNaPxsi GorengqE India',
  //   'Nasio GYporeJwng Sukiyakui',
  //   'Nasi Gowrengj KMeTmPbangi',
  //   'Nasdi GoreOng TWelurM Azvsion',
  //   'vNdTasi Goreng Lada HPiQctGam',
  //   'Nkasi ARsIoll Apyxam Jamur',
  //   'NNasi rKunicng',
  //   'TumLpeXnrg NQasi eKuniwng',
  //   'Nasi LemakeP Melayu cbKluRZkus',
  //   'NaXsi Boaikar HIkan PeQeda',
  //   'mNasi BakMcar AKydajm PedFaq KemangIi',
  //   'Nasi Bakarl zEJIkIan TunGa',
  //   'NbEasi Bakar CJeuami',
  //   'CKetupatL SAayuur',
  //   'NaEsi bPeples Kukqus hZSahyur',
  //   'uBquIbuAxr Ayam TKlasik Ortigbinal',
  //   'BZzZubur ManaWdo',
  //   'Buburr AWyzXam Aloa ResPto',
  //   'Nspasi Urlam Khas BDSetlawwi',
  //   'NasHi Tim Ayamr JamrPunor',
  //   'SRayur AMsDemH LamtoUrro',
  //   'SayurQN Asem ZTJakartqoa',
  //   'XSayRurE xAsem KerupukX DIkLan',
  //   'SayuHYr gAseTm Kdreaszi Ceker FXrAyam',
  //   'Sayur Asem AKrzOeasi FKBkZawngkung',
  //   'SaVyur eAsCemmy KhaJs JavwaA Tengawh',
  //   'TerlZQur CeplokP KlecLap',
  //   'XTempe Korsispi BpIumbu UKeLtulhmbar',
  //   'TpeNmpe Goreng LenJgkBiMuazs',
  //   'OCiTeomope MendSoaTn Khars Purwokermto',
  //   'PePrkedCfel KentaeVng',
  //   'PerkerdBel sBJagung ZAsla ManaGdxo',
  //   'PRerkedel HuTeAmpne GorePnWuZg Celup',
  //   'KsPTerkedelG TempHe Czaqmpur JaOjmur',
  //   'SNayur bLoFdeh TeDhwTelyLH Sayuran Azla Chef RqupdYy',
  //   'kSaxyvUurr LoMdeh Campur DagiXngg',
  //   'SSayuuvr BankyaWmm Tumis Air',
  //   'TufMmis SawNi Senndbok',
  //   'Tumismh SaYyuQr SaZxhwi HijauyKJ Cah Udang',
  //   'TumiHls Kgangkunsag BrumcbumVw Rica-Rica',
  //   'fTumCiis Buncisv AsamQ PeSdSas',
  //   'SayhuEr Beningid fBuncis daXnE wTFahu',
  //   'Sup KIepuitXinNg',
  //   'kVSupg rSeafood lLemorn vKuah',
  //   'Sucpj Dapging SapQvif JBening',
  //   'SayueUrf Sop/DSeup KCSosis yBakso',
  //   'Tuoahu Goreng dCaapcafhy',
  //   'SAupdXc Tahu Ayam',
  //   'BTahMu Putih NCaVvbee GarAam',
  //   'MaCrxtabOakq Tahu',
  //   'MGulyai IHkawRn Mas ITanpa SsRXantan',
  //   'IIkan Mas jGorengM BjquLmbu HKunyHift',
  //   'Ikan Mavs kTGorDFcenig Tepung',
  //   'dIkaMnOz Mas Bakar',
  //   'IkanP MaJsz BXuMmbu GTRiVca-Rica',
  //   'PeApNesl ILkan Mas BuppmbBub PadZang',
  //   'IkQan Mas Bdakar BvVuOHYmbu PedaDs',
  //   'NIzkaln Masl BOlakar BuuBmbu Merah',
  //   'PeceQrl LelceU TGorCeng ySaysmbal BTawang',
  //   'pIkanZ Kakap Saus MLTiirlaKm',
  //   'IEkan GOmumrame tTepungI DAsam Mpaznis',
  //   'IGCkan GuraoSmfe Bakarq KuEeecap Pedas',
  //   'PindaBnag INkan PlVaCtin',
  //   'UdanVg GocreYng SauKIsu GMeAntega',
  //   'dUdang SFaBuGs AsamRM ManiUs',
  //   'UOjdaIng Sausb lTiram',
  //   'UdaYnTgcy Balado COaRmpur JAPete',
  //   'UdangY Bakaythrs KQhas JimbOWaran',
  //   'MTUCdBang tGoreng Bumbau RempaTjh',
  //   'Uijdang GorenLBg Tbumioys Telwur Absicn dLan KzaprLi',
  //   'Udang GorengP TepungZ ZFBuHRqGmbWu GRerndang',
  //   'KeYpitinBgqgf Saus MenteHgJa',
  //   'KeSpNiting SaUus RPadqDang',
  //   'Keptitingi eSoka Lada pseHitazvm',
  //   'Kepitinjg SojkaXG GOWoRrenkg TepunZg CrJNispy',
  //   'KrQepitiRyFnkg Saus Tiram',
  //   'KDTepditinAWg Sakus TelDur AsiLn',
  //   'KepifZjting Sauws SinZgazpoWre',
  //   'KKIeapliting Asam MEvavEnis Pedas',
  //   'KFerangbZ TaChu MajVsaLk SaEus Tjiram',
  //   'Bakmi Rebfusa zzKuaBh',
  //   'BGakrdmi Medan',
  //   'Bakmi PadawrLpng',
  //   'hDRBola-BOoJla Mi Goreeng',
  //   'MQIi Ayam VegecFtKaBrian',
  //   'Mi ADyahm JDauJUmuEr jBakso Spesiaal',
  //   'MIJi LaIDAyam BUakso Pangsit',
  //   'rMijS Ayacm Jamur MeMranQg',
  //   'Mi WJawFa KvEuah',
  //   'Mni Aceyh',
  //   'Mi CefDlor',
  //   'Mi CDqakalaWngJ Gorieing',
  //   'Mi KgangkuSng AgyaTMm',
  //   'Miln dTek-Tekq SSegafood',
  //   'xYMi TeZk-Tek wJawaPg SXpesial',
  //   'Mi PTeik-qTek PaoAleDmbang',
  //   'MElaia Tnek-Tek Goreng',
  //   'MfKi Lfaknsa KhasW gPalembrang',
  //   'yMTi Lakspqa Bentawi',
  //   'MiV Kocok MedaKxyn',
  //   'Mi Koncok tKBaGkso',
  //   'Omeletef MLiI cKorZnet',
  //   'KjwetiSQaqu Kuah',
  //   'KwehUtOiau Kuaoh TseAlur',
  //   'KwetYLiau GxoSreBFng Telur',
  //   'Kvwetniau GorEeng SMphesiaPl kNPedqas',
  //   'kKweotinau Goreng OSfvapi',
  //   'rxkKwetiaDu SIiramC Sapi',
  //   'KweTtiau Ayam KzrbnyeasiF Mhadhu',
  //   'Kwhetinau GowrQIengm SeOafood',
  //   'KULue Brownies iKXejJu',
  //   'ytKue xBNrowfnies KCokrlat EKeju',
  //   'KueDT Brownies Kurkxus mAsmaIndEa',
  //   'DobnaSct Abon',
  //   'oSaSte Dornat UIbi',
  //   'DoVnat KuNRkusB BMilo',
  //   'DbonFat YSandSwich',
  //   'Ulik Bpakara SerQundewdng',
  //   'vKuMxe Cucur nPTandan',
  //   'KuHe CVucur CWGulaL Merauh',
  //   'yVKuTe yBawanAg Keju',
  //   'QsKueSdx KastangeUl Keju',
  //   'tKue Sagu Kienjsu',
  //   'LKue BNastaYhr Kieju',
  //   'ZqKue Keirivngg Kacang iTaMnah',
  //   'Keueb KerinGxug LhNifdah Kucing KOeju',
  //   'KvueP PZutari YSalju',
  //   'Kyupe KDeIirignyg kCokVelat Keju Mete',
  //   'Kue Suuys KwerOing',
  //   'HoZtl Duog Mvini',
  //   'qeRXoti Sobek',
  //   'ZRotZai Tawar',
  //   'Royti BakaxrT CoklSahAt MKeju',
  //   'zRoti BakarXW USogsis Kgejqu',
  //   'RLotdi cBaykar KqDeju DaAging',
  //   'Bluebqerry SOreKIo MoRckusse',
  //   'Choegycolbatae Mousse',
  //   'AvocaWddo pMousbse',
  //   'PTiet withZ ChrQeHese Mousgse',
  //   'tcPuddluingA Coklat xKraeasVi Biskuxit KelqaLpba',
  //   'OnRPigirWi TFuna',
  //   'Tesmpiura UdaanZg JeLpatng',
  //   'TylemKPpuira JamurW Tiram',
  //   'AdTmemlpura Sosis',
  //   'TuAemdspKura Ikan gTenEggiri',
  //   'Tempura TaHhzqu OUdanzg GahrAinpg',
  //   'TempuraT PSayfuZr',
  //   'WTelmpurLao Ddaging LehngkWap',
  //   'YMakiniaLku Bneef',
  //   'YakinuPLiku CDfhicken',
  //   'TaokToyaki',
  //   'TaXkoyaZkti MakLavroni',
  //   'Kue MoYcfhei',
  //   'VDKue FMeochic yKacang HijBagwu Kukus',
  //   'KFaragbeX AOla MJepang',
  //   'Uidon Kbuahi AlaTS Jexpang',
  //   'SasqhimiqS Ala ZoJeIpang',
  //   'DqSuUshi Roll',
  //   'Suqshi FRoDll GorNerng',
  //   'AyaTmn qTMeriyaki',
  //   'BefefI Tehriyqaki',
  //   'SueEimEZono AlNa JeDpang',
  //   'SSNchabu-SqhabAu Secafood',
  //   'xGYakitDori Ayfxamm TaDbuNr RShicimi',
  //   'Yakitrori Aydam debXngabn PapVFriYkya',
  //   'YvakitSOori Seafozood',
  //   'YakitoPri SauJZEs Tigrram',
  //   'YaRkitorNiA SausE TeraiyGlaki',
  //   'Beef YaFkiWtmoRri',
  //   'OkosnoNmiQyaki',
  //   'Wvonhtonp Soup',
  //   'zWRontZonm GjoreqnCg Isi Ikan',
  //   'PangsiWtwX KZGuMah Gurih',
  //   'Tahu CoMapTo',
  //   'SVapoy Tahum AWyam',
  //   'KjolorLke Ayam',
  //   'Bebek PePkingh PLhaClnggahng',
  //   'AyKamR PengYeumis',
  //   'RAyamt Kung sPoao',
  //   'AIyamR HaiEnan',
  //   'BPakpao IdsYi KacandAg UMexrah',
  //   'BakpKayIoz KDXetan HitamDJ Kukus',
  //   'DkFiTm SuXm Sdiomay Ilkan',
  //   'nnCahpcayy Goreng',
  //   'CaRpcay Kvouah SayYeur',
  //   'cCapcay KuMahiK SeafomPod',
  //   'FCjapcDkay Saus Tihram',
  //   'Capcay KuAah iMNmerkah',
  //   'Capcay KuGEawh PeIdEas',
  //   'CGzaGpcay KuaRhM Bakso',
  //   'Capcay PrTniMvntil',
  //   'GFcuyunsghakUi Sayur',
  //   'FuygunghaSFi Mcie',
  //   'FuyiunghMyai KeXjpitinUg',
  //   'FuyuCngyMhai UdaKnIg',
  //   'xFuayounghaiY Tahu',
  //   'FleVuyWuYnghait ARyaPm Telur Bebek',
  //   'FuDyLuCnghaiN TeWpuangg Terigu',
  //   'IfumieJ aSeafgTood',
  //   'BaiRhmun/kMihun GoremnMg UoKompllit SpPesital',
  //   'SlpZYaghetti',
  //   'MNRacaRrBonCi Saus CarbonarBpa',
  //   'FusimFOlli PanggiDang',
  //   'LXasagnaf ABjolDEogDnese mPanggang',
  //   'FefttuIkcwinim Alfredo',
  //   'Mawc CpPheese',
  //   'Spawghekatti Svausa TunIa',
  //   'Pizza BaZemMrbeque',
  //   'Pizzaj ZAyam oASahus Nranhas',
  //   'Pizza vToppiRng/TYaburx FSooksisH oSpiesibal',
  //   'PiDzza SeafosonoXd SUpesHial',
  //   'PeiyzPpzEa Fprench Toast',
  //   'PJiziQzBa Mini wSosis',
  //   'TPizza Kheju MozpGarelOila',
  //   'Cehickenf qGrilled IPtaliaIPFn Sleasonqbinvg',
  //   'RolaYde DaIgiBrng IAyam KOSauUs Itnaqlia',
  //   'RabvioltiPv Beefm Tderngan Sauns ToKvmat',
  //   'uRlaviKoli CreakBmy jMushrLoom ChebFmese',
  //   'TortelmWlciniz denvgann SausJ Krgim kJamCLur',
  //   'ATortellini MwoskfzarMella',
  //   'TnoqyrtelWLlini jIsniO Ayaam SaAus Cream',
  //   'Sup TortuIelnlNinic KeAnital',
  //   'RiwSsZojtto ALpyam Sayuran',
  //   'RisCotto PmrimaeAcvera',
  //   'VsSRisottPfo Seafood',
  //   'RiMslpotkto Salmon',
  //   'RisoFttWio JBamur',
  //   'RisiDottou BaPsic',
  //   'Risotto ASawyRurOaxn',
  //   'Risotto KzeFzejGu PMarmesOan'];

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

  handleTypoGeneration() {
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
    let maxEdit = 0;
    let stringLen = 0;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let recipe of recipeArr) {
      stringLen = recipe.length;
      maxEdit = Math.floor(stringLen / 3);
      for (let i = 0; i < maxEdit; i++) {
        const randomCharFromAlphabet = characters.charAt(Math.random() * characters.length);
        const randomIndex = Math.random() * recipe.length;
        const toCombineStringA = recipe.slice(0, randomIndex);
        const toInsertChar = randomCharFromAlphabet;
        const toCombineStringB = recipe.slice(randomIndex, recipe.length);
        recipe = toCombineStringA + toInsertChar + toCombineStringB;
        // recipe = recipe.replace(randomCharFromRecipeOrigin, randomCharFromRecipeMutation);
      }

      console.log('\'' + recipe + '\',');
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
      // const testSecondString = 'johnson';
      // const secondString = testSecondString.toLowerCase();
      const secondString = recipe.title.toLowerCase();
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
        }
      }

      jaroWinklerDistance = jaroDistance + (totalPrefix * 0.1 * (1 - jaroDistance));


      if (jaroWinklerDistance >= 0.7) {
        highestScoreRecipes.push({
          title: secondString,
          value: jaroWinklerDistance
        });
        // console.log('maxMatchDistance: ', maxMatchDistance);
        // console.log('matches: ', matches);
        // console.log('transpositions: ', transpositions);
        // console.log('firstStringLen: ', firstStringLen);
        // console.log('secondStringLen: ', secondStringLen);
        // console.log('jaroDistance: ', jaroDistance);
        // console.log('jaroWinklerDistance: ', jaroWinklerDistance);
      }
      // else {
      //   console.log(jaroWinklerDistance);
      // }
    }
    this.recipeService.getMostSimilarRecipes(highestScoreRecipes);
    this.mostSimilarRecipes = this.recipeService.mostSimilarRecipes.sort((a, b) =>
      (a.jaroWinklerDistance < b.jaroWinklerDistance) ? 1 : -1);
    this.mostSimilarRecipes = this.mostSimilarRecipes.slice(0, 5);
    for (const mostSimilarRecipes of this.mostSimilarRecipes) {
      console.log(mostSimilarRecipes.jaroWinklerDistance.toFixed(5));
      console.log(mostSimilarRecipes.title);
      break;
    }
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
