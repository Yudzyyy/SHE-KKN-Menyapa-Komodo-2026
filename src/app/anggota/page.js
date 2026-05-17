"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';

// Initial pre-populated mockup data for realistic representation
const INITIAL_MEMBERS = [
  // Warloka Pesisir (15 members)
  {
    id: "M-101",
    name: "Budi Santoso",
    nim: "22/492135/TK/54123",
    major: "Teknik Kelautan",
    phone: "+62 812-3456-7890",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Alergi makanan laut (ringan)",
    medicalNotes: "Selalu sediakan obat antihistamin saat survei lapangan.",
    emergencyContactName: "Siti Rahma",
    emergencyContactRelation: "Ibu",
    emergencyContactPhone: "+62 811-2233-4455",
    village: "Warloka Pesisir"
  },
  {
    id: "M-102",
    name: "Siti Aminah",
    nim: "22/493412/GL/54211",
    major: "Teknik Geologi",
    phone: "+62 813-9876-5432",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: false,
    medicalHistory: "Asma (ringan)",
    medicalNotes: "Wajib membawa inhaler pribadi di dalam tas lapangan.",
    emergencyContactName: "Ahmad Fauzi",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 812-3344-5566",
    village: "Warloka Pesisir"
  },
  {
    id: "M-103",
    name: "Rian Hidayat",
    nim: "22/495123/IK/54390",
    major: "Ilmu Kelautan",
    phone: "+62 821-4455-6677",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Kondisi fisik prima, siap untuk penyelaman lapangan.",
    emergencyContactName: "Dewi Lestari",
    emergencyContactRelation: "Kakak",
    emergencyContactPhone: "+62 815-5566-7788",
    village: "Warloka Pesisir"
  },
  {
    id: "M-104",
    name: "Aditya Pratama",
    nim: "22/496221/TM/54456",
    major: "Teknik Mesin",
    phone: "+62 812-5566-9900",
    profilePic: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
    canSwim: false,
    noSeasick: false,
    medicalHistory: "Alergi debu & cuaca dingin",
    medicalNotes: "Gunakan masker di area tambang/berdebu. Hindari shift malam dingin.",
    emergencyContactName: "Joko Pratama",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 811-6677-8899",
    village: "Warloka Pesisir"
  },
  {
    id: "M-105",
    name: "Larasati Putri",
    nim: "22/497332/TL/54567",
    major: "Teknik Lingkungan",
    phone: "+62 819-2233-8844",
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Maag kronis",
    medicalNotes: "Wajib makan tepat waktu. Selalu bawa obat lambung (Antasida).",
    emergencyContactName: "Rini Astuti",
    emergencyContactRelation: "Ibu",
    emergencyContactPhone: "+62 812-8899-0011",
    village: "Warloka Pesisir"
  },
  {
    id: "M-106",
    name: "Farhan Ramadhan",
    nim: "22/498443/TS/54678",
    major: "Teknik Sipil",
    phone: "+62 857-1122-3344",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
    canSwim: false,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Fisik sehat, disarankan rompi keselamatan ekstra di dekat air.",
    emergencyContactName: "Bambang",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 813-9900-1122",
    village: "Warloka Pesisir"
  },
  {
    id: "M-107",
    name: "Dian Lestari",
    nim: "22/499554/BI/54789",
    major: "Biologi",
    phone: "+62 878-4455-8899",
    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: false,
    medicalHistory: "Alergi dingin (kaligata)",
    medicalNotes: "Hindari berenang di air bersuhu sangat rendah tanpa wetsuit.",
    emergencyContactName: "Hendra Lestari",
    emergencyContactRelation: "Kakak",
    emergencyContactPhone: "+62 812-1122-4455",
    village: "Warloka Pesisir"
  },
  {
    id: "M-108",
    name: "Eko Wijaya",
    nim: "22/500665/TG/54890",
    major: "Teknik Geofisika",
    phone: "+62 812-9900-8877",
    profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Riwayat cedera lutut",
    medicalNotes: "Hindari membawa beban ransel melebihi 15kg saat tracking lapangan.",
    emergencyContactName: "Sri Utami",
    emergencyContactRelation: "Ibu",
    emergencyContactPhone: "+62 811-3344-9900",
    village: "Warloka Pesisir"
  },
  {
    id: "M-109",
    name: "Rina Amelia",
    nim: "22/501776/KG/54901",
    major: "Kedokteran Gigi",
    phone: "+62 877-6655-4433",
    profilePic: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Kondisi sehat, aktif melakukan penyuluhan kesehatan gigi warga pesisir.",
    emergencyContactName: "Susilo",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 813-4455-6677",
    village: "Warloka Pesisir"
  },
  {
    id: "M-110",
    name: "Guntur Wibowo",
    nim: "22/502887/SP/55012",
    major: "Sosiologi",
    phone: "+62 822-7788-9900",
    profilePic: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
    canSwim: false,
    noSeasick: false,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Fisik baik, siap bertugas untuk survei sosio-ekonomi masyarakat pesisir.",
    emergencyContactName: "Hariyanti",
    emergencyContactRelation: "Ibu",
    emergencyContactPhone: "+62 812-9988-7766",
    village: "Warloka Pesisir"
  },
  {
    id: "M-111",
    name: "Mega Lestari",
    nim: "22/503998/AN/55123",
    major: "Antropologi",
    phone: "+62 819-3344-5566",
    profilePic: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Alergi seafood ringan",
    medicalNotes: "Hindari konsumsi kerang laut selama kegiatan lapangan.",
    emergencyContactName: "Kartolo",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 815-7766-5544",
    village: "Warloka Pesisir"
  },
  {
    id: "M-112",
    name: "Yusuf Maulana",
    nim: "22/504109/AR/55234",
    major: "Arsitektur",
    phone: "+62 812-4455-8811",
    profilePic: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120",
    canSwim: false,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Merancang tata ruang fasilitas air bersih mess Warloka.",
    emergencyContactName: "Siti Zubaidah",
    emergencyContactRelation: "Ibu",
    emergencyContactPhone: "+62 811-9988-0011",
    village: "Warloka Pesisir"
  },
  {
    id: "M-113",
    name: "Fitri Handayani",
    nim: "22/505220/FA/55345",
    major: "Farmasi",
    phone: "+62 878-5566-7788",
    profilePic: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: false,
    medicalHistory: "Migren",
    medicalNotes: "Wajib membawa obat pereda nyeri kepala pribadi.",
    emergencyContactName: "Ahmad Dahlan",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 812-4433-2211",
    village: "Warloka Pesisir"
  },
  {
    id: "M-114",
    name: "Hendra Setiawan",
    nim: "22/506331/KT/55456",
    major: "Kehutanan",
    phone: "+62 813-1122-3399",
    profilePic: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Ahli survei rehabilitasi hutan bakau/mangrove di pesisir.",
    emergencyContactName: "Rudi Setiawan",
    emergencyContactRelation: "Kakak",
    emergencyContactPhone: "+62 815-9988-7711",
    village: "Warloka Pesisir"
  },
  {
    id: "M-115",
    name: "Nina Kartika",
    nim: "22/507442/PS/55567",
    major: "Psikologi",
    phone: "+62 812-8899-7722",
    profilePic: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Menjalankan program trauma healing dan bimbingan belajar anak pesisir.",
    emergencyContactName: "Sri Rahayu",
    emergencyContactRelation: "Ibu",
    emergencyContactPhone: "+62 813-7766-5544",
    village: "Warloka Pesisir"
  },
  // Golo Mori (15 members)
  {
    id: "M-116",
    name: "Adelia Siregar",
    nim: "22/508553/GK/55678",
    major: "Gizi Kesehatan",
    phone: "+62 813-4455-9922",
    profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Kondisi prima. Penanggung jawab menu dapur mess Golo Mori.",
    emergencyContactName: "Roni Siregar",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 812-7766-4433",
    village: "Golo Mori"
  },
  {
    id: "M-117",
    name: "Reza Fahlevi",
    nim: "22/509664/KU/55789",
    major: "Kedokteran",
    phone: "+62 811-9988-7744",
    profilePic: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Dokter posko. Membawa tas P3K lengkap di setiap kegiatan luar posko.",
    emergencyContactName: "Maimunah",
    emergencyContactRelation: "Ibu",
    emergencyContactPhone: "+62 812-9900-1122",
    village: "Golo Mori"
  },
  {
    id: "M-118",
    name: "Amalia Rizki",
    nim: "22/510775/AK/55900",
    major: "Arkeologi",
    phone: "+62 878-1122-3377",
    profilePic: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: false,
    medicalHistory: "Alergi debu",
    medicalNotes: "Selalu sediakan masker saat melakukan ekskavasi/survei goa.",
    emergencyContactName: "Syarifuddin",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 813-8899-7766",
    village: "Golo Mori"
  },
  {
    id: "M-119",
    name: "Dimas Nugraha",
    nim: "22/511886/HK/56011",
    major: "Hukum",
    phone: "+62 812-6677-4411",
    profilePic: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Penyuluhan hukum agraria bagi warga desa Golo Mori.",
    emergencyContactName: "Ratih Nugraha",
    emergencyContactRelation: "Ibu",
    emergencyContactPhone: "+62 811-4455-6677",
    village: "Golo Mori"
  },
  {
    id: "M-120",
    name: "Clarissa Putri",
    nim: "22/512997/MN/56122",
    major: "Manajemen",
    phone: "+62 819-4433-2211",
    profilePic: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=120",
    canSwim: false,
    noSeasick: false,
    medicalHistory: "Vertigo ringan",
    medicalNotes: "Hindari aktivitas dengan guncangan tinggi di atas perahu.",
    emergencyContactName: "Julianto",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 812-9988-7722",
    village: "Golo Mori"
  },
  {
    id: "M-121",
    name: "Bayu Pamungkas",
    nim: "22/514108/TE/56233",
    major: "Teknik Elektro",
    phone: "+62 813-7788-9911",
    profilePic: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Instalasi panel surya mandiri untuk penerangan jalan desa Golo Mori.",
    emergencyContactName: "Sudirman",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 812-3344-5599",
    village: "Golo Mori"
  },
  {
    id: "M-122",
    name: "Hana Safitri",
    nim: "22/515219/IK/56344",
    major: "Ilmu Komunikasi",
    phone: "+62 878-8877-6655",
    profilePic: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Maag",
    medicalNotes: "Hindari makanan pedas berlebih saat makan bersama warga.",
    emergencyContactName: "Linda Safitri",
    emergencyContactRelation: "Ibu",
    emergencyContactPhone: "+62 813-4455-0011",
    village: "Golo Mori"
  },
  {
    id: "M-123",
    name: "Fahmi Idris",
    nim: "22/516330/TI/56455",
    major: "Teknik Industri",
    phone: "+62 857-7788-9944",
    profilePic: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=120",
    canSwim: false,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Optimasi alur distribusi kerajinan tangan khas warga lokal.",
    emergencyContactName: "Syamsul Idris",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 812-4455-8899",
    village: "Golo Mori"
  },
  {
    id: "M-124",
    name: "Indah Permata",
    nim: "22/517441/SA/56566",
    major: "Sastra Inggris",
    phone: "+62 812-9900-5566",
    profilePic: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Mengajar kelas bahasa Inggris pariwisata untuk pemuda pemudi Golo Mori.",
    emergencyContactName: "Purnomo",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 813-7766-3322",
    village: "Golo Mori"
  },
  {
    id: "M-125",
    name: "Kevin Sanjaya",
    nim: "22/518552/PW/56677",
    major: "Pembangunan Wilayah",
    phone: "+62 819-2211-0033",
    profilePic: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Pemetaan potensi wisata bahari di sekitar kawasan Golo Mori.",
    emergencyContactName: "Hariyanto",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 812-3344-9988",
    village: "Golo Mori"
  },
  {
    id: "M-126",
    name: "Mutiara Hati",
    nim: "22/519663/KH/56788",
    major: "Kedokteran Hewan",
    phone: "+62 878-4433-2299",
    profilePic: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: false,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Pemeriksaan kesehatan ternak sapi warga di dataran Golo Mori.",
    emergencyContactName: "Endang",
    emergencyContactRelation: "Ibu",
    emergencyContactPhone: "+62 813-1122-3388",
    village: "Golo Mori"
  },
  {
    id: "M-127",
    name: "Pandu Dewanata",
    nim: "22/520774/GL/56899",
    major: "Geografi Lingkungan",
    phone: "+62 812-7788-5544",
    profilePic: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Alergi gigitan serangga",
    medicalNotes: "Wajib membawa lotion anti serangga saat turun ke lapangan.",
    emergencyContactName: "Prabowo",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 812-9988-2211",
    village: "Golo Mori"
  },
  {
    id: "M-128",
    name: "Sarah Azhari",
    nim: "22/521885/KM/57010",
    major: "Kimia",
    phone: "+62 813-3344-5511",
    profilePic: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=120",
    canSwim: false,
    noSeasick: false,
    medicalHistory: "Asma ringan",
    medicalNotes: "Selalu sedia inhaler di saku jaket lapangan.",
    emergencyContactName: "Farida",
    emergencyContactRelation: "Ibu",
    emergencyContactPhone: "+62 811-5566-7788",
    village: "Golo Mori"
  },
  {
    id: "M-129",
    name: "Taufik Hidayat",
    nim: "22/522996/TN/57121",
    major: "Teknik Nuklir",
    phone: "+62 812-5566-4433",
    profilePic: "https://images.unsplash.com/photo-1504257486388-941f3d868718?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Tidak ada riwayat penyakit",
    medicalNotes: "Membantu edukasi teknologi tepat guna berbasis sains.",
    emergencyContactName: "Hidayat",
    emergencyContactRelation: "Ayah",
    emergencyContactPhone: "+62 812-7788-9900",
    village: "Golo Mori"
  },
  {
    id: "M-130",
    name: "Yuni Shara",
    nim: "22/524107/AK/57232",
    major: "Akuntansi",
    phone: "+62 819-7788-6655",
    profilePic: "https://images.unsplash.com/photo-1534751516642-a131ffa10615?auto=format&fit=crop&q=80&w=120",
    canSwim: true,
    noSeasick: true,
    medicalHistory: "Gastritis",
    medicalNotes: "Pastikan makan pagi sebelum memulai pendataan pembukuan posko.",
    emergencyContactName: "Syahrini",
    emergencyContactRelation: "Kakak",
    emergencyContactPhone: "+62 813-8877-6655",
    village: "Golo Mori"
  }
];

export default function Anggota() {
  // App States
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSwim, setFilterSwim] = useState("all");
  const [filterSeasick, setFilterSeasick] = useState("all");
  const [filterMajor, setFilterMajor] = useState("all");
  const [filterVillage, setFilterVillage] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Modals & Active Elements States
  const [activeTab, setActiveTab] = useState("anggota");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Profile Dropdown state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  // Form States for Add/Edit
  const [formName, setFormName] = useState("");
  const [formNim, setFormNim] = useState("");
  const [formMajor, setFormMajor] = useState("Teknik Kelautan");
  const [formPhone, setFormPhone] = useState("");
  const [formCanSwim, setFormCanSwim] = useState(true);
  const [formNoSeasick, setFormNoSeasick] = useState(true);
  const [formMedicalHistory, setFormMedicalHistory] = useState("");
  const [formMedicalNotes, setFormMedicalNotes] = useState("");
  const [formEmergencyName, setFormEmergencyName] = useState("");
  const [formEmergencyRelation, setFormEmergencyRelation] = useState("Ibu");
  const [formEmergencyPhone, setFormEmergencyPhone] = useState("");
  const [formVillage, setFormVillage] = useState("Warloka Pesisir");

  const itemsPerPage = 15;

  // Load members from Supabase (with fallback to localStorage/INITIAL_MEMBERS for first-run sync)
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('anggota')
          .select('*')
          .order('nama', { ascending: true });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Map database columns to app property names
          const mappedData = data.map(m => {
            let extra = {};
            if (m.catatan) {
              try {
                extra = JSON.parse(m.catatan);
              } catch (e) {
                // Fallback if notes is a regular text
                extra = { medicalNotes: m.catatan };
              }
            }
            return {
              id: m.id,
              name: m.nama,
              nim: extra.nim || "-",
              major: m.jabatan || extra.major || "-", 
              phone: m.no_hp || extra.phone || "-",
              profilePic: extra.profilePic || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 10}`,
              canSwim: extra.canSwim !== undefined ? extra.canSwim : true,
              noSeasick: extra.noSeasick !== undefined ? extra.noSeasick : true,
              medicalHistory: extra.medicalHistory || "Tidak ada riwayat penyakit",
              medicalNotes: extra.medicalNotes || "Sehat walafiat.",
              emergencyContactName: extra.emergencyContactName || "Tidak ada",
              emergencyContactRelation: extra.emergencyContactRelation || "Ibu",
              emergencyContactPhone: extra.emergencyContactPhone || "-",
              village: m.posko || "Warloka Pesisir"
            };
          });
          setMembers(mappedData);
          localStorage.setItem('she_members', JSON.stringify(mappedData));
        } else {
          // If Supabase table is empty, pre-populate it with INITIAL_MEMBERS!
          const insertPayload = INITIAL_MEMBERS.map(m => {
            const extra = {
              nim: m.nim,
              profilePic: m.profilePic,
              canSwim: m.canSwim,
              noSeasick: m.noSeasick,
              medicalHistory: m.medicalHistory,
              medicalNotes: m.medicalNotes,
              emergencyContactName: m.emergencyContactName,
              emergencyContactRelation: m.emergencyContactRelation,
              emergencyContactPhone: m.emergencyContactPhone
            };
            return {
              nama: m.name,
              posko: m.village,
              jabatan: m.major,
              no_hp: m.phone,
              kondisi: 'Sehat',
              catatan: JSON.stringify(extra)
            };
          });

          const { data: insertedData, error: insertError } = await supabase
            .from('anggota')
            .insert(insertPayload)
            .select();

          if (insertError) {
            console.error("Gagal inisialisasi data di Supabase:", insertError.message);
            // Fallback to local INITIAL_MEMBERS
            setMembers(INITIAL_MEMBERS);
          } else if (insertedData) {
            // Map the newly inserted data
            const mappedInserted = insertedData.map(m => {
              let extra = {};
              if (m.catatan) {
                try {
                  extra = JSON.parse(m.catatan);
                } catch (e) {
                  extra = {};
                }
              }
              return {
                id: m.id,
                name: m.nama,
                nim: extra.nim || "-",
                major: m.jabatan || extra.major || "-",
                phone: m.no_hp || extra.phone || "-",
                profilePic: extra.profilePic || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 10}`,
                canSwim: extra.canSwim !== undefined ? extra.canSwim : true,
                noSeasick: extra.noSeasick !== undefined ? extra.noSeasick : true,
                medicalHistory: extra.medicalHistory || "Tidak ada riwayat penyakit",
                medicalNotes: extra.medicalNotes || "Sehat walafiat.",
                emergencyContactName: extra.emergencyContactName || "Tidak ada",
                emergencyContactRelation: extra.emergencyContactRelation || "Ibu",
                emergencyContactPhone: extra.emergencyContactPhone || "-",
                village: m.posko || "Warloka Pesisir"
              };
            });
            setMembers(mappedInserted);
            localStorage.setItem('she_members', JSON.stringify(mappedInserted));
          }
        }
      } catch (err) {
        console.error("Gagal sinkronisasi Supabase, menggunakan fallback LocalStorage:", err.message);
        // Fallback to LocalStorage
        const stored = localStorage.getItem('she_members');
        if (stored) {
          try {
            setMembers(JSON.parse(stored));
          } catch (e) {
            setMembers(INITIAL_MEMBERS);
          }
        } else {
          setMembers(INITIAL_MEMBERS);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Show Toast helper
  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get distinct majors for filter dropdown
  const allMajors = useMemo(() => {
    const majors = members.map(m => m.major);
    return ["all", ...new Set(majors)];
  }, [members]);

  // Filtered & Searched Members list
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.nim.includes(searchQuery) ||
        member.major.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSwim = 
        filterSwim === "all" ? true :
        filterSwim === "yes" ? member.canSwim : !member.canSwim;

      const matchesSeasick = 
        filterSeasick === "all" ? true :
        filterSeasick === "no-seasick" ? member.noSeasick : !member.noSeasick;

      const matchesMajor = 
        filterMajor === "all" ? true : member.major === filterMajor;

      const matchesVillage = 
        filterVillage === "all" ? true : member.village === filterVillage;

      return matchesSearch && matchesSwim && matchesSeasick && matchesMajor && matchesVillage;
    });
  }, [members, searchQuery, filterSwim, filterSeasick, filterMajor, filterVillage]);

  // Paginated Members list
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterSwim, filterSeasick, filterMajor, filterVillage]);

  // Simulate quick loader for search and filters
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear all filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterSwim("all");
    setFilterSeasick("all");
    setFilterMajor("all");
    setFilterVillage("all");
    triggerToast("Filter berhasil direset", "info");
  };

  // CRUD actions
  const openDetailModal = (member) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

  const openAddModal = () => {
    // Reset Form
    setFormName("");
    setFormNim("");
    setFormMajor("Teknik Kelautan");
    setFormPhone("");
    setFormCanSwim(true);
    setFormNoSeasick(true);
    setFormMedicalHistory("");
    setFormMedicalNotes("");
    setFormEmergencyName("");
    setFormEmergencyRelation("Ibu");
    setFormEmergencyPhone("");
    setFormVillage("Warloka Pesisir");
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formNim || !formPhone) {
      triggerToast("Mohon lengkapi data wajib (Nama, NIM, No. HP)", "error");
      return;
    }

    setIsLoading(true);
    const randomAvatarNum = Math.floor(Math.random() * 70) + 10;
    const avatarUrl = `https://i.pravatar.cc/150?img=${randomAvatarNum}`;

    const extra = {
      nim: formNim,
      profilePic: avatarUrl,
      canSwim: formCanSwim,
      noSeasick: formNoSeasick,
      medicalHistory: formMedicalHistory || "Tidak ada riwayat penyakit",
      medicalNotes: formMedicalNotes || "Sehat walafiat, siap bertugas.",
      emergencyContactName: formEmergencyName || "Tidak ada",
      emergencyContactRelation: formEmergencyRelation,
      emergencyContactPhone: formEmergencyPhone || "-"
    };

    try {
      const { data, error } = await supabase
        .from('anggota')
        .insert([
          {
            nama: formName,
            posko: formVillage,
            jabatan: formMajor,
            no_hp: formPhone,
            kondisi: 'Sehat',
            catatan: JSON.stringify(extra)
          }
        ])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const added = {
          id: data[0].id,
          name: data[0].nama,
          nim: formNim,
          major: data[0].jabatan,
          phone: data[0].no_hp,
          profilePic: avatarUrl,
          canSwim: formCanSwim,
          noSeasick: formNoSeasick,
          medicalHistory: formMedicalHistory || "Tidak ada riwayat penyakit",
          medicalNotes: formMedicalNotes || "Sehat walafiat, siap bertugas.",
          emergencyContactName: formEmergencyName || "Tidak ada",
          emergencyContactRelation: formEmergencyRelation,
          emergencyContactPhone: formEmergencyPhone || "-",
          village: data[0].posko
        };

        const updatedList = [added, ...members];
        setMembers(updatedList);
        localStorage.setItem('she_members', JSON.stringify(updatedList));
        triggerToast("Anggota baru berhasil ditambahkan!");
      }
    } catch (err) {
      console.error(err);
      triggerToast(`Gagal menambahkan anggota: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
      setShowAddModal(false);
    }
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setFormName(member.name);
    setFormNim(member.nim);
    setFormMajor(member.major);
    setFormPhone(member.phone);
    setFormCanSwim(member.canSwim);
    setFormNoSeasick(member.noSeasick);
    setFormMedicalHistory(member.medicalHistory);
    setFormMedicalNotes(member.medicalNotes);
    setFormEmergencyName(member.emergencyContactName);
    setFormEmergencyRelation(member.emergencyContactRelation);
    setFormEmergencyPhone(member.emergencyContactPhone);
    setFormVillage(member.village || "Warloka Pesisir");
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      triggerToast("Mohon lengkapi data wajib (Nama & No. HP)", "error");
      return;
    }

    setIsLoading(true);
    const extra = {
      nim: formNim,
      profilePic: selectedMember.profilePic,
      canSwim: formCanSwim,
      noSeasick: formNoSeasick,
      medicalHistory: formMedicalHistory,
      medicalNotes: formMedicalNotes,
      emergencyContactName: formEmergencyName,
      emergencyContactRelation: formEmergencyRelation,
      emergencyContactPhone: formEmergencyPhone
    };

    try {
      const { error } = await supabase
        .from('anggota')
        .update({
          nama: formName,
          posko: formVillage,
          jabatan: formMajor,
          no_hp: formPhone,
          catatan: JSON.stringify(extra)
        })
        .eq('id', selectedMember.id);

      if (error) throw error;

      const updatedList = members.map(m => m.id === selectedMember.id ? {
        ...m,
        name: formName,
        nim: formNim,
        major: formMajor,
        phone: formPhone,
        canSwim: formCanSwim,
        noSeasick: formNoSeasick,
        medicalHistory: formMedicalHistory,
        medicalNotes: formMedicalNotes,
        emergencyContactName: formEmergencyName,
        emergencyContactRelation: formEmergencyRelation,
        emergencyContactPhone: formEmergencyPhone,
        village: formVillage
      } : m);
      setMembers(updatedList);
      localStorage.setItem('she_members', JSON.stringify(updatedList));
      triggerToast("Data anggota berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      triggerToast(`Gagal merubah data: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
      setShowEditModal(false);
    }
  };

  const confirmDelete = (member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('anggota')
        .delete()
        .eq('id', memberToDelete.id);

      if (error) throw error;

      const updatedList = members.filter(m => m.id !== memberToDelete.id);
      setMembers(updatedList);
      localStorage.setItem('she_members', JSON.stringify(updatedList));
      triggerToast("Anggota berhasil dihapus!", "success");
    } catch (err) {
      console.error(err);
      triggerToast(`Gagal menghapus anggota: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setMemberToDelete(null);
    }
  };

  return (
    <div className="bg-[#f8fafc] text-slate-800 min-h-screen antialiased flex font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] flex items-center gap-3 bg-white px-5 py-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-l-4 border-emerald-500 animate-slide-in">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
            toast.type === "success" ? "bg-emerald-500" :
            toast.type === "error" ? "bg-rose-500" : "bg-sky-500"
          }`}>
            <span className="material-symbols-outlined text-base">
              {toast.type === "success" ? "check" :
               toast.type === "error" ? "error" : "info"}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm text-slate-900">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Backdrop Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* 2. SIDEBAR - Elegant white responsive drawer */}
      <aside className={`fixed left-0 top-0 h-full w-[260px] z-50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col py-8 px-4 border-r border-slate-100 transition-transform duration-300 lg:translate-x-0 ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Mobile Close Button inside sidebar */}
        <button 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden absolute top-5 right-5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Brand / Logo */}
        <div className="px-3 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-500/20">
              S
            </div>
            <div>
              <h1 className="font-bold text-[15px] text-slate-900 leading-tight tracking-wide font-poppins">SHE Monitoring</h1>
              <p className="text-[10px] text-emerald-600 font-semibold tracking-normal mt-0.5 leading-snug">KKN PPM UGM Menyapa Komodo 2026</p>
            </div>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
          <Link 
            className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" 
            href="/"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">dashboard</span>
            <span>Dashboard</span>
          </Link>
          
          <Link 
            className="bg-emerald-50/80 text-emerald-700 font-bold rounded-xl pl-3.5 pr-4 py-3 flex items-center gap-3.5 border-l-4 border-emerald-500 transition-all text-[14px]" 
            href="/anggota"
          >
            <span className="material-symbols-outlined text-xl text-emerald-600" style={{ fontVariationSettings: '"FILL" 1' }}>group</span>
            <span>Anggota</span>
          </Link>

          <Link 
            className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" 
            href="/aktivitas"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">task_alt</span>
            <span>Aktivitas Harian</span>
          </Link>

          <Link 
            className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" 
            href="/insiden"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">report_problem</span>
            <span>Insiden</span>
          </Link>

          <Link 
            className="group text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/30 rounded-xl px-4 py-3 flex items-center gap-3.5 transition-all duration-200 font-semibold text-[14px]" 
            href="/emergency"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-emerald-500 transition-colors">contact_phone</span>
            <span>Emergency Contact</span>
          </Link>
        </nav>

      </aside>

      {/* Main Content Wrapper - Responsive margin left */}
      <div className="lg:ml-[260px] flex-1 flex flex-col min-h-screen relative overflow-x-hidden w-full">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-50/60 via-slate-50/30 to-transparent -z-10" />

        {/* 3. TOPBAR - Sleek minimal responsive header */}
        <header className="sticky top-0 w-full z-30 border-b border-slate-100 bg-white/70 backdrop-blur-md shadow-sm flex justify-between items-center h-20 px-4 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle Button */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-emerald-600 hover:bg-slate-50 p-2.5 rounded-xl transition-all border border-slate-100 mr-1"
            >
              <span className="material-symbols-outlined text-xl leading-none">menu</span>
            </button>

            <h2 className="font-poppins font-bold text-lg lg:text-xl text-slate-800 hidden sm:block">SHE Dashboard</h2>
            
            {/* Realtime Search Bar */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
              <input 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-slate-800 w-44 sm:w-60 md:w-80 shadow-inner" 
                placeholder="Cari anggota, NIM, prodi..." 
                type="text" 
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Notification bell */}
            <button className="text-slate-500 hover:text-emerald-600 hover:bg-slate-50 transition-all rounded-full p-2.5 relative border border-slate-100">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
            
            {/* Avatar Admin with interactive Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-50 border border-slate-100 transition-all focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-500/30">
                  <img 
                    alt="Admin Profile" 
                    className="w-full h-full object-cover" 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" 
                  />
                </div>
                <span className="font-semibold text-xs text-slate-700 pr-2 hidden md:block">Adelia Siregar</span>
                <span className="material-symbols-outlined text-slate-400 text-sm hidden md:block">keyboard_arrow_down</span>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 py-2.5 z-50 animate-fade-in">
                  <div className="px-4.5 py-2.5 border-b border-slate-50 mb-1.5">
                    <p className="font-bold text-sm text-slate-800">Adelia Siregar</p>
                    <p className="text-[11px] text-slate-400">Koordinator SHE Lapangan</p>
                  </div>
                  <a href="#" className="flex items-center gap-2.5 px-4.5 py-2 text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                    <span className="material-symbols-outlined text-base">person</span> Profil Saya
                  </a>
                  <a href="#" className="flex items-center gap-2.5 px-4.5 py-2 text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                    <span className="material-symbols-outlined text-base">security</span> Kebijakan Privasi
                  </a>
                  <hr className="my-1.5 border-slate-100" />
                  <a href="#" className="flex items-center gap-2.5 px-4.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors">
                    <span className="material-symbols-outlined text-base">logout</span> Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Workspace Canvas */}
        <main className="flex-1 p-8 flex flex-col gap-6.5 max-w-7xl w-full mx-auto">
          
          {/* 4. HEADER SECTION - Modern SaaS Layout */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-[12px] text-emerald-600 font-semibold mb-1">
                <Link href="/" className="hover:underline">Dashboard</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-slate-400">Anggota</span>
              </div>
              <h2 className="font-poppins font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight">
                Direktori Anggota Tim
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium max-w-2xl">
                Kelola data personal, kualifikasi fisik, riwayat medis, dan kontak darurat anggota lapangan SHE Monitoring.
              </p>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                  isFilterPanelOpen || filterSwim !== "all" || filterSeasick !== "all" || filterMajor !== "all"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 shadow-sm"
                }`}
              >
                <span className="material-symbols-outlined text-base">filter_list</span>
                Filter
                {(filterSwim !== "all" || filterSeasick !== "all" || filterMajor !== "all") && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                )}
              </button>
              
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                Tambah Anggota
              </button>
            </div>
          </div>

          {/* Collapsible Filter Panel */}
          {isFilterPanelOpen && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md shadow-slate-100 flex flex-col gap-4 animate-slide-down">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <span className="font-bold text-sm text-slate-800">Filter Pencarian Tingkat Lanjut</span>
                <button 
                  onClick={resetFilters}
                  className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-xs">restart_alt</span> Reset Semua Filter
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Major Filter */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Program Studi</label>
                  <select 
                    value={filterMajor}
                    onChange={(e) => setFilterMajor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3.5 text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">Semua Program Studi</option>
                    {allMajors.filter(m => m !== "all").map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                {/* Swim capability Filter */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Kemampuan Berenang</label>
                  <select 
                    value={filterSwim}
                    onChange={(e) => setFilterSwim(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3.5 text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="yes">Bisa Berenang</option>
                    <option value="no">Tidak Bisa Berenang</option>
                  </select>
                </div>
                {/* Seasick Filter */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Mabuk Laut</label>
                  <select 
                    value={filterSeasick}
                    onChange={(e) => setFilterSeasick(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3.5 text-xs text-slate-700 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="no-seasick">Tidak Mabuk Laut</option>
                    <option value="seasick">Mabuk Laut</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 5. TABLE / MEMBER CARD - Modern Clean Responsive Card */}
          <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col flex-1">
            
            {/* Village Tabs Selector */}
            <div className="flex flex-col sm:flex-row border-b border-slate-100 bg-slate-50/50 p-2 gap-1.5 sm:gap-2">
              <button
                onClick={() => { setFilterVillage("all"); setCurrentPage(1); }}
                className={`flex items-center justify-center sm:justify-start gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  filterVillage === "all"
                    ? "bg-white text-emerald-700 shadow-sm border border-slate-100"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                <span className="material-symbols-outlined text-base">groups</span>
                Semua Wilayah
                <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  filterVillage === "all" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                }`}>
                  {members.length}
                </span>
              </button>

              <button
                onClick={() => { setFilterVillage("Warloka Pesisir"); setCurrentPage(1); }}
                className={`flex items-center justify-center sm:justify-start gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  filterVillage === "Warloka Pesisir"
                    ? "bg-white text-emerald-700 shadow-sm border border-slate-100"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                <span className="material-symbols-outlined text-base">water_drop</span>
                Warloka Pesisir
                <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  filterVillage === "Warloka Pesisir" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                }`}>
                  {members.filter(m => m.village === "Warloka Pesisir").length}
                </span>
              </button>

              <button
                onClick={() => { setFilterVillage("Golo Mori"); setCurrentPage(1); }}
                className={`flex items-center justify-center sm:justify-start gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  filterVillage === "Golo Mori"
                    ? "bg-white text-emerald-700 shadow-sm border border-slate-100"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                <span className="material-symbols-outlined text-base">landscape</span>
                Golo Mori
                <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  filterVillage === "Golo Mori" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                }`}>
                  {members.filter(m => m.village === "Golo Mori").length}
                </span>
              </button>
            </div>

            {/* Search Bar - Kolom Pencarian Berdasarkan Nama */}
            <div className="p-4.5 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Cari nama anggota tim..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-slate-800 shadow-inner"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-semibold self-end sm:self-auto shrink-0 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
                Menampilkan <span className="text-emerald-700 font-bold">{filteredMembers.length}</span> dari <span className="text-slate-700 font-bold">{members.length}</span> anggota
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pl-8 pr-4 py-4 w-18">Profil</th>
                    <th className="px-5 py-4">Info Personal</th>
                    <th className="px-5 py-4 w-52">Kualifikasi Fisik</th>
                    <th className="px-5 py-4">Riwayat Medis</th>
                    <th className="px-5 py-4 w-60">Kontak Darurat</th>
                    <th className="pl-4 pr-8 py-4 text-right w-36">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {isLoading ? (
                    // 8. UX - Loading Skeleton
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse bg-white">
                        <td className="pl-8 pr-4 py-5.5">
                          <div className="w-11 h-11 bg-slate-100 rounded-full" />
                        </td>
                        <td className="px-5 py-5.5">
                          <div className="h-4 bg-slate-100 rounded-md w-36 mb-2" />
                          <div className="h-3 bg-slate-100 rounded-md w-48" />
                        </td>
                        <td className="px-5 py-5.5">
                          <div className="h-5.5 bg-slate-100 rounded-full w-28 mb-1.5" />
                          <div className="h-5.5 bg-slate-100 rounded-full w-32" />
                        </td>
                        <td className="px-5 py-5.5">
                          <div className="h-3.5 bg-slate-100 rounded-md w-44 mb-1.5" />
                          <div className="h-3 bg-slate-100 rounded-md w-36" />
                        </td>
                        <td className="px-5 py-5.5">
                          <div className="h-4 bg-slate-100 rounded-md w-24 mb-1.5" />
                          <div className="h-3.5 bg-slate-100 rounded-md w-32" />
                        </td>
                        <td className="pl-4 pr-8 py-5.5 text-right">
                          <div className="flex gap-2 justify-end">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                            <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : paginatedMembers.length > 0 ? (
                    paginatedMembers.map((member) => (
                      <tr 
                        key={member.id} 
                        className="hover:bg-slate-50/40 group transition-all duration-300 relative"
                      >
                        {/* 6. PROFILE SECTION - Avatar */}
                        <td className="pl-8 pr-4 py-5.5">
                          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500/20 shadow-sm group-hover:border-emerald-500/50 transition-colors">
                            <img 
                              alt={member.name} 
                              className="w-full h-full object-cover" 
                              src={member.profilePic} 
                            />
                          </div>
                        </td>

                        {/* Personal Info */}
                        <td className="px-5 py-5.5">
                          <div className="font-poppins font-bold text-sm text-slate-800 leading-tight flex items-center gap-2 flex-wrap">
                            {member.name}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              member.village === "Golo Mori"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-100"
                            }`}>
                              {member.village || "Warloka Pesisir"}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1 font-medium">
                            NIM: {member.nim} • <span className="text-emerald-700 font-semibold">{member.major}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {member.phone}
                          </div>
                        </td>

                        {/* Physical Qualification Badge Pills */}
                        <td className="px-5 py-5.5">
                          <div className="flex flex-col gap-1.5 items-start">
                            {member.canSwim ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-inner">
                                <span className="material-symbols-outlined text-[12px] mr-1">pool</span> Bisa Berenang
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100 shadow-inner">
                                <span className="material-symbols-outlined text-[12px] mr-1">pool</span> Tidak Berenang
                              </span>
                            )}

                            {member.noSeasick ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-inner">
                                <span className="material-symbols-outlined text-[12px] mr-1">sailing</span> Bebas Mabuk Laut
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 shadow-inner">
                                <span className="material-symbols-outlined text-[12px] mr-1">sailing</span> Mabuk Laut
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Medical History */}
                        <td className="px-5 py-5.5 max-w-[220px]">
                          <div className="font-semibold text-xs text-slate-800 truncate">
                            {member.medicalHistory}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {member.medicalNotes}
                          </div>
                        </td>

                        {/* Emergency Contact */}
                        <td className="px-5 py-5.5">
                          <div className="font-semibold text-xs text-slate-800">
                            {member.emergencyContactName} 
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full ml-1.5">
                              {member.emergencyContactRelation}
                            </span>
                          </div>
                          <div className="text-[11px] text-rose-500 font-bold mt-1 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs">phone_in_talk</span>
                            {member.emergencyContactPhone}
                          </div>
                        </td>

                        {/* 7. ACTION BUTTONS - Premium animated colors */}
                        <td className="pl-4 pr-8 py-5.5 text-right whitespace-nowrap">
                          <div className="flex gap-1.5 justify-end opacity-75 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openDetailModal(member)}
                              className="w-8.5 h-8.5 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white transition-all duration-300 flex items-center justify-center border border-sky-100 shadow-inner shadow-sky-500/5"
                              title="Detail Lengkap"
                            >
                              <span className="material-symbols-outlined text-base">visibility</span>
                            </button>
                            <button 
                              onClick={() => openEditModal(member)}
                              className="w-8.5 h-8.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center justify-center border border-emerald-100 shadow-inner shadow-emerald-500/5"
                              title="Ubah Data"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button 
                              onClick={() => confirmDelete(member)}
                              className="w-8.5 h-8.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center justify-center border border-rose-100 shadow-inner shadow-rose-500/5"
                              title="Hapus Anggota"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // 8. UX - Empty State View
                    <tr>
                      <td colSpan="6" className="py-20 px-8 text-center bg-white">
                        <div className="max-w-md mx-auto flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-3xl">groups_3</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-base">Tidak Ada Anggota yang Cocok</h3>
                            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                              Tidak ditemukan data anggota yang cocok dengan kata kunci "{searchQuery}" atau filter yang sedang aktif.
                            </p>
                          </div>
                          <button 
                            onClick={resetFilters}
                            className="mt-2 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            Reset Filter & Pencarian
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Layout (8. UX Responsive) */}
            <div className="lg:hidden p-4 flex flex-col gap-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="animate-pulse bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-3.5">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-slate-100 rounded w-28 mb-1.5" />
                        <div className="h-3 bg-slate-100 rounded w-44" />
                      </div>
                    </div>
                    <div className="h-8 bg-slate-100 rounded-xl w-full" />
                    <div className="flex justify-end gap-2 mt-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                      <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                    </div>
                  </div>
                ))
              ) : paginatedMembers.length > 0 ? (
                paginatedMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 relative group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500/20 shadow-sm">
                        <img alt={member.name} className="w-full h-full object-cover" src={member.profilePic} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 font-poppins leading-tight flex items-center gap-1.5 flex-wrap">
                          {member.name}
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${
                            member.village === "Golo Mori"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                              : "bg-emerald-50 text-emerald-700 border-emerald-100"
                          }`}>
                            {member.village || "Warloka Pesisir"}
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">NIM: {member.nim} • <span className="text-emerald-700 font-semibold">{member.major}</span></p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-b border-slate-50 py-2.5">
                      {member.canSwim ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Swim
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                          No Swim
                        </span>
                      )}

                      {member.noSeasick ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Anti Mabuk
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          Mabuk Laut
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Emergency</p>
                        <p className="font-semibold text-slate-800 mt-0.5">{member.emergencyContactName} ({member.emergencyContactRelation})</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openDetailModal(member)}
                          className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                        <button 
                          onClick={() => openEditModal(member)}
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button 
                          onClick={() => confirmDelete(member)}
                          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center bg-white border rounded-2xl p-8">
                  <span className="material-symbols-outlined text-slate-300 text-3xl mb-2 block">groups</span>
                  <p className="text-slate-400 text-xs font-medium">Tidak ada anggota yang cocok dengan filter aktif.</p>
                </div>
              )}
            </div>

            {/* 8. UX - Modern Pagination Bar */}
            <div className="bg-slate-50/50 border-t border-slate-100 px-8 py-5.5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-medium text-slate-500">
                Menampilkan <strong className="text-slate-800 font-bold">{filteredMembers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> - <strong className="text-slate-800 font-bold">{Math.min(currentPage * itemsPerPage, filteredMembers.length)}</strong> dari <strong className="text-slate-800 font-bold">{filteredMembers.length}</strong> anggota tim
              </span>

              <div className="flex items-center gap-1.5">
                <button 
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs leading-none">arrow_back</span>
                  Kembali
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-7.5 h-7.5 rounded-lg text-xs font-bold transition-all ${
                      currentPage === idx + 1
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages || isLoading}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all flex items-center gap-1"
                >
                  Lanjut
                  <span className="material-symbols-outlined text-xs leading-none">arrow_forward</span>
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ============================================================ */}
      {/* MODALS SECTION (Premium animations & Glassmorphism) */}
      {/* ============================================================ */}

      {/* 6. PROFILE / DETAIL MODAL */}
      {showDetailModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/95 rounded-3xl w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-scale-up relative">
            <button 
              onClick={() => setShowDetailModal(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center text-slate-400"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {/* Passport Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-10 text-white relative">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
              <div className="flex flex-col sm:flex-row gap-5.5 items-center relative z-10">
                <div className="w-22 h-22 rounded-full overflow-hidden border-4 border-white/20 shadow-lg shrink-0">
                  <img alt={selectedMember.name} className="w-full h-full object-cover" src={selectedMember.profilePic} />
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h3 className="font-poppins font-extrabold text-2xl tracking-tight">{selectedMember.name}</h3>
                    <span className="bg-white/20 backdrop-blur-md text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Active
                    </span>
                  </div>
                  <p className="text-emerald-100/90 text-sm mt-1 font-medium">{selectedMember.major} • NIM: {selectedMember.nim}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2 justify-center sm:justify-start">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Desa Penugasan: {selectedMember.village || "Warloka Pesisir"}
                    </span>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Hub: {selectedMember.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-8 flex flex-col gap-6.5">
              {/* Grid physical capabilities */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/60 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedMember.canSwim ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    <span className="material-symbols-outlined text-lg">pool</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kemampuan Berenang</p>
                    <p className="font-bold text-slate-700 text-sm mt-0.5">{selectedMember.canSwim ? "Bisa Berenang" : "Tidak Berenang"}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/60 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedMember.noSeasick ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    <span className="material-symbols-outlined text-lg">sailing</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ketahanan Laut</p>
                    <p className="font-bold text-slate-700 text-sm mt-0.5">{selectedMember.noSeasick ? "Bebas Mabuk Laut" : "Mabuk Laut"}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-emerald-600">vaccines</span>
                  Riwayat Medis & Kesehatan
                </h4>
                <div className="bg-rose-50/50 border border-rose-100/50 rounded-2xl p-4.5">
                  <p className="text-slate-800 font-bold text-sm">{selectedMember.medicalHistory}</p>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed font-medium">
                    <strong className="text-rose-700 font-bold">Catatan Penanganan:</strong> {selectedMember.medicalNotes}
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-emerald-600">contact_phone</span>
                  Hubungi Kontak Darurat
                </h4>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-800 font-bold">{selectedMember.emergencyContactName}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5 uppercase">{selectedMember.emergencyContactRelation}</p>
                  </div>
                  <a 
                    href={`tel:${selectedMember.emergencyContactPhone}`}
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-rose-500/10 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span className="material-symbols-outlined text-sm">phone_in_talk</span>
                    {selectedMember.emergencyContactPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-scale-up">
            <div className="bg-emerald-950 text-white px-8 py-6 flex items-center justify-between">
              <div>
                <h3 className="font-poppins font-bold text-lg">Tambah Anggota Tim Baru</h3>
                <p className="text-emerald-300/80 text-[11px] mt-0.5">Lengkapi formulir di bawah ini untuk mendaftarkan personil.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-emerald-900 hover:bg-emerald-800 text-emerald-200 transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="p-8 max-h-[70vh] overflow-y-auto flex flex-col gap-5 text-xs text-slate-700">
                
                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Nama Lengkap *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Masukkan nama lengkap"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">NIM *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Masukkan NIM"
                      value={formNim}
                      onChange={(e) => setFormNim(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Program Studi *</label>
                    <select 
                      value={formMajor}
                      onChange={(e) => setFormMajor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="Teknik Kelautan">Teknik Kelautan</option>
                      <option value="Teknik Geologi">Teknik Geologi</option>
                      <option value="Ilmu Kelautan">Ilmu Kelautan</option>
                      <option value="Teknik Mesin">Teknik Mesin</option>
                      <option value="Teknik Sipil">Teknik Sipil</option>
                      <option value="Teknik Lingkungan">Teknik Lingkungan</option>
                      <option value="Biologi">Biologi</option>
                      <option value="Teknik Geofisika">Teknik Geofisika</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">No. Handphone *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="+62 8..."
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Desa Penugasan *</label>
                    <select 
                      value={formVillage}
                      onChange={(e) => setFormVillage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-700"
                    >
                      <option value="Warloka Pesisir">Warloka Pesisir</option>
                      <option value="Golo Mori">Golo Mori</option>
                    </select>
                  </div>
                </div>

                {/* Quals Grid */}
                <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 flex flex-col gap-3">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">Kualifikasi Fisik Lapangan</p>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formCanSwim} 
                        onChange={(e) => setFormCanSwim(e.target.checked)}
                        className="w-4.5 h-4.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" 
                      />
                      <span className="font-semibold text-slate-700">Dapat Berenang dengan Baik</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formNoSeasick} 
                        onChange={(e) => setFormNoSeasick(e.target.checked)}
                        className="w-4.5 h-4.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" 
                      />
                      <span className="font-semibold text-slate-700">Bebas Mabuk Laut / Tahan Gelombang</span>
                    </label>
                  </div>
                </div>

                {/* Medical Info */}
                <div className="flex flex-col gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Riwayat Medis / Penyakit Bawaan</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama penyakit, alergi, atau ketik 'Tidak ada'"
                      value={formMedicalHistory}
                      onChange={(e) => setFormMedicalHistory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Catatan Lapangan Khusus</label>
                    <textarea 
                      placeholder="Tulis instruksi khusus keselamatan / sedia obat pribadi"
                      rows="3"
                      value={formMedicalNotes}
                      onChange={(e) => setFormMedicalNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-rose-50/20 rounded-2xl p-4.5 border border-rose-100/30 flex flex-col gap-3.5">
                  <p className="font-bold text-rose-800 text-[11px] uppercase tracking-wide">Kontak Darurat Keluarga</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Nama Kontak</label>
                      <input 
                        type="text" 
                        placeholder="Nama wali"
                        value={formEmergencyName}
                        onChange={(e) => setFormEmergencyName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Hubungan</label>
                      <select 
                        value={formEmergencyRelation}
                        onChange={(e) => setFormEmergencyRelation(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="Ibu">Ibu Kandung</option>
                        <option value="Ayah">Ayah Kandung</option>
                        <option value="Kakak">Kakak Kandung</option>
                        <option value="Saudara">Saudara/Kerabat</option>
                        <option value="Wali">Wali</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Nomor Telepon Darurat</label>
                      <input 
                        type="text" 
                        placeholder="+62 8..."
                        value={formEmergencyPhone}
                        onChange={(e) => setFormEmergencyPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-scale-up">
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white px-8 py-6 flex items-center justify-between">
              <div>
                <h3 className="font-poppins font-bold text-lg">Ubah Data Anggota</h3>
                <p className="text-emerald-300/80 text-[11px] mt-0.5">Perbarui informasi personal maupun kesehatan lapangan {selectedMember.name}.</p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full bg-emerald-900 hover:bg-emerald-800 text-emerald-200 transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="p-8 max-h-[70vh] overflow-y-auto flex flex-col gap-5 text-xs text-slate-700">
                
                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Nama Lengkap *</label>
                    <input 
                      required
                      type="text" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">NIM *</label>
                    <input 
                      required
                      type="text" 
                      value={formNim}
                      onChange={(e) => setFormNim(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Program Studi *</label>
                    <select 
                      value={formMajor}
                      onChange={(e) => setFormMajor(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    >
                      <option value="Teknik Kelautan">Teknik Kelautan</option>
                      <option value="Teknik Geologi">Teknik Geologi</option>
                      <option value="Ilmu Kelautan">Ilmu Kelautan</option>
                      <option value="Teknik Mesin">Teknik Mesin</option>
                      <option value="Teknik Sipil">Teknik Sipil</option>
                      <option value="Teknik Lingkungan">Teknik Lingkungan</option>
                      <option value="Biologi">Biologi</option>
                      <option value="Teknik Geofisika">Teknik Geofisika</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">No. Handphone *</label>
                    <input 
                      required
                      type="text" 
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Desa Penugasan *</label>
                    <select 
                      value={formVillage}
                      onChange={(e) => setFormVillage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-700"
                    >
                      <option value="Warloka Pesisir">Warloka Pesisir</option>
                      <option value="Golo Mori">Golo Mori</option>
                    </select>
                  </div>
                </div>

                {/* Quals Grid */}
                <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 flex flex-col gap-3">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">Kualifikasi Fisik Lapangan</p>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formCanSwim} 
                        onChange={(e) => setFormCanSwim(e.target.checked)}
                        className="w-4.5 h-4.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" 
                      />
                      <span className="font-semibold text-slate-700">Dapat Berenang dengan Baik</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formNoSeasick} 
                        onChange={(e) => setFormNoSeasick(e.target.checked)}
                        className="w-4.5 h-4.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" 
                      />
                      <span className="font-semibold text-slate-700">Bebas Mabuk Laut / Tahan Gelombang</span>
                    </label>
                  </div>
                </div>

                {/* Medical Info */}
                <div className="flex flex-col gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Riwayat Medis / Penyakit Bawaan</label>
                    <input 
                      type="text" 
                      value={formMedicalHistory}
                      onChange={(e) => setFormMedicalHistory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Catatan Lapangan Khusus</label>
                    <textarea 
                      rows="3"
                      value={formMedicalNotes}
                      onChange={(e) => setFormMedicalNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-rose-50/20 rounded-2xl p-4.5 border border-rose-100/30 flex flex-col gap-3.5">
                  <p className="font-bold text-rose-800 text-[11px] uppercase tracking-wide">Kontak Darurat Keluarga</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Nama Kontak</label>
                      <input 
                        type="text" 
                        value={formEmergencyName}
                        onChange={(e) => setFormEmergencyName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Hubungan</label>
                      <select 
                        value={formEmergencyRelation}
                        onChange={(e) => setFormEmergencyRelation(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="Ibu">Ibu Kandung</option>
                        <option value="Ayah">Ayah Kandung</option>
                        <option value="Kakak">Kakak Kandung</option>
                        <option value="Saudara">Saudara/Kerabat</option>
                        <option value="Wali">Wali</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-500 mb-1">Nomor Telepon Darurat</label>
                      <input 
                        type="text" 
                        value={formEmergencyPhone}
                        onChange={(e) => setFormEmergencyPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-scale-up">
            <div className="p-6.5 text-center flex flex-col items-center gap-4">
              <div className="w-13 h-13 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100 shadow-inner">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              
              <div>
                <h3 className="font-poppins font-bold text-lg text-slate-900">Hapus Anggota Tim?</h3>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed font-medium">
                  Apakah Anda yakin ingin menghapus data anggota <strong className="text-slate-800 font-bold">{memberToDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-6.5 py-4 border-t border-slate-100 flex justify-center gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleDeleteSubmit}
                className="px-4.5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-500/10"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}