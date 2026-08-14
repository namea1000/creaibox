const cheerio = require('cheerio');
const fs = require('fs');

const clicknHtml = `<header class='w-full bg-white border-b border-gray-100 sticky top-0 z-50'><div class='bg-[#262832] text-white py-2.5 px-4 text-center text-xs md:text-sm flex justify-between items-center'><div class='mx-auto flex items-center space-x-2'><span class='font-semibold'>1.0% 수수료 쇼핑몰 바로 오픈</span><span class='hidden sm:inline text-gray-300'>| 5분 만에 신청하고 오늘 바로 결제받기</span></div></div><div class='flex justify-between items-center w-full px-4 md:px-8 xl:px-12 py-3.5'><div class='flex items-center space-x-8'><a href='/' class='flex items-center'><img src='logo.svg' alt='클릭엔' class='h-7 w-auto'></a><nav class='hidden lg:flex items-center space-x-7 text-sm font-medium text-gray-800'><a href='/intro/homepage' class='hover:text-[#0063FD] flex items-center gap-1'>주요기능</a></nav></div><div class='flex items-center space-x-3'><a href='/member/login' class='text-sm text-gray-700 hover:text-black font-medium px-3 py-2'>로그인</a></div></div></header>`;

const shopifyHtml = `<header class='sticky top-0 z-50 w-full bg-[#02090a]/90 backdrop-blur-md border-b border-[#121C1E] text-white px-4 md:px-8 xl:px-12'><nav class='flex items-center justify-between h-18 w-full'><div class='flex items-center gap-8'><a href='/kr' class='shrink-0'><img src='logo.svg' alt='Shopify' class='h-8'/></a><div class='hidden lg:flex items-center gap-6 text-sm font-medium'><a href='/kr/start'>시작하세요</a></div></div><div class='flex items-center gap-4'><a href='/login'>로그인</a></div></nav></header>`;

const abocadoHtml = `<header class='w-full border-b border-gray-800 bg-[#0A0D10] text-white sticky top-0 z-50 px-4 md:px-8 xl:px-12'><div class='flex justify-between items-center h-16 w-full'><a href='/' class='flex items-center gap-2'><img src='logo.svg' alt='Abocado AI' class='h-6 w-auto'/></a><div class='flex items-center gap-6'><nav class='hidden lg:flex items-center gap-6 text-sm font-medium'><a href='/models' class='text-gray-300 hover:text-white transition-colors flex items-center gap-1'>AI Models</a></nav><div class='hidden sm:flex items-center gap-4 border-l border-gray-700 pl-6'><a href='/login' class='text-sm text-gray-300 hover:text-white transition-colors'>Sign In</a></div></div></div></header>`;

function test(html, name) {
  const $ = cheerio.load(html, null, false);
  
  // Find nav container
  // It's usually <nav> or a div with 'hidden lg:flex'. We MUST exclude the main row which has 'justify-between'.
  let navContainer = $('nav, .hidden\\.lg\\:flex, .hidden\\.md\\:flex').not('.justify-between').first();
  
  if (navContainer.length === 0) {
    navContainer = $('div:has(> a:nth-child(2))').first();
  }
  
  if (navContainer.length > 0) {
    // 1. Find the "Header Row": The closest ancestor that has `justify-between`
    let headerRow = navContainer.closest('.justify-between');
    if (headerRow.length === 0) {
       // Fallback to the widest flex container in header
       headerRow = navContainer.parents().filter((i, el) => $(el).hasClass('flex')).last();
       if (headerRow.length === 0) headerRow = $('header');
    }
    
    if (headerRow.length > 0) {
       const parent = navContainer.parent();
       if (parent.get(0) !== headerRow.get(0)) {
         let ancestor = navContainer;
         while (ancestor.parent().length > 0 && ancestor.parent().get(0) !== headerRow.get(0)) {
           ancestor = ancestor.parent();
         }
         
         if (ancestor.parent().get(0) === headerRow.get(0)) {
            // Un-nest it!
            const index = ancestor.index();
            const siblingsCount = headerRow.children().length;
            
            if (index === 0) {
                navContainer.insertAfter(ancestor);
            } else if (index === siblingsCount - 1) {
                navContainer.insertBefore(ancestor);
            } else {
                navContainer.insertAfter(ancestor);
            }
         }
       }
    }
    
    navContainer.addClass('mx-auto');
  }
  
  console.log(`\n\n--- ${name} ---`);
  console.log($.html());
}

test(clicknHtml, 'clickn');
test(shopifyHtml, 'shopify');
test(abocadoHtml, 'abocado');
