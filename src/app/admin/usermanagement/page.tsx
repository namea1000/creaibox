"use client";

import React from 'react';
import UserManagement from "../../../components/admin/UserManagement";
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#05070a]">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        {/* 관리자 페이지는 넓게 쓰는 게 좋으니 1600px급으로 배치 */}
        <UserManagement />
      </main>
      <Footer />
    </div>
  );
}