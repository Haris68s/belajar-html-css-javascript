let jam = document.getElementById("output-jam")



function hitungWaktu() {

    let waktu = new Date();
    let hari = waktu.getDay();
    let bulan = waktu.getMonth();
    let tahun = waktu.getFullYear();
    let time = waktu.getHours();
    let menit = waktu.getMinutes();
    let detik = waktu.getSeconds();


 switch (bulan) {
    case 0:
         bulan = "january"
         break;
     case 1:
         bulan = "febuary"
         break;
     case 2:
         bulan = "maret"
         break;
     case 3:
         bulan = "april"
         break;
     case 4:
         bulan = "Mei"
         break;
     case 5:
         bulan = "juni"
         break;
     case 6:
         bulan = "july"
         break;
     case 7:
         bulan = "agustus"
         break;
     case 8:
         bulan = "september"
         break;
     case 9:
         bulan = "oktober"
         break;
     case 10:
         bulan = "november"
         break;
     case 11:
         bulan = "desember"
         break;
     
    }

   if (detik < 10) {
       detik = "0" + detik;
   } else {
       detik = detik;
    }
    if (menit < 10) {
        menit = "0" + menit
    } else {
        menit =menit
    }
    

    let Day = ["minggu","senin","selasa","rabu","kamis","jumat","sabtu"]

    

    jam.innerText = `${Day[hari]} - ${bulan} - ${tahun}: ${time} : ${menit} : ${detik} `


};
setInterval(hitungWaktu, 1000);
hitungWaktu();

function kurangHari() {
    let pilihWaktu =new Date()
    let selectTime = document.getElementById("waktu-dipilih")
    let batas = new Date(document.getElementById("batas").value)
    

    let hasilAkhir = Math.ceil(pilihWaktu - batas)
    let akhir =Math.floor(  hasilAkhir / (1000 * 60 * 60 * 24))
    
    
    let hitung = akhir* -1

    if (hitung < 0) {
        let kurang = hitung * -1 
        
        selectTime.innerHTML = `kelewat ${kurang } hari `
    } else if (hitung > 0) {
        selectTime.innerHTML = `kurang ${hitung} hari`
    }
        
    
    
    
}