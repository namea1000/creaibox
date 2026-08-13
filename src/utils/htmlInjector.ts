import * as cheerio from 'cheerio';

/**
 * Injects dynamic menus into a static AI-generated HTML string.
 * It finds the navigation container (like <nav>), extracts the styling of the existing <a> tags,
 * clears them, and injects the new dynamic menus with the exact same styling.
 */
export function injectMenusIntoHtml(html: string, menus: { label: string; path: string }[]): string {
  try {
    const $ = cheerio.load(html, null, false);

    // 0. Fix Logo Link: typically the very first <a> tag in the header HTML is the logo.
    const firstA = $('a').first();
    if (firstA.length > 0) {
      firstA.attr('href', '/');
    }

    // 0.5. Make Header Edge-to-Edge (Full Bleed)
    // Original sites often have logos on the far left and menus on the far right.
    // AI often wraps them in `max-w-7xl mx-auto`. We strip this from the main container.
    const mainContainer = $('header > div').first().length ? $('header > div').first() : $('div').first();
    if (mainContainer.length > 0) {
      let cls = mainContainer.attr('class') || '';
      // Remove any max-w-* and ensure it's w-full
      cls = cls.replace(/max-w-[a-zA-Z0-9\-]+/g, 'w-full');
      // Boost horizontal padding for ultra-wide screens so it doesn't touch the literal pixel edge
      if (!cls.includes('px-')) {
        cls += ' px-6 2xl:px-12';
      } else {
        // Upgrade existing padding to be wider on large screens
        if (!cls.includes('2xl:px-')) {
          cls += ' 2xl:px-12';
        }
      }
      mainContainer.attr('class', cls);
    }

    if (!menus || menus.length === 0) {
      return $.html();
    }

    // 1. Look for explicit <nav> tags first
    let navContainer = $('nav').first();
    let templateA: any = null;

    if (navContainer.length > 0) {
      templateA = navContainer.find('a').first();
      // Force center alignment for the navigation container within a flex header
      navContainer.addClass('mx-auto');
    } else {
      // 2. Fallback: Find a div that acts like a nav (contains multiple <a> tags as direct children)
      navContainer = $('div:has(> a:nth-child(2))').first();
      if (navContainer.length > 0) {
        templateA = navContainer.children('a').first();
        navContainer.addClass('mx-auto');
      }
    }

    if (navContainer.length > 0 && templateA && templateA.length > 0) {
      // Extract the class and other styling from the first original top-level <a> tag
      const className = templateA.attr('class') || '';

      // DO NOT REMOVE original links! This preserves the original Mega Menus and dropdowns.
      // We only want to append new custom subpages to the end of the navigation.
      
      const existingLabels = new Set();
      navContainer.find('a').each((_, el) => {
        existingLabels.add($(el).text().trim());
      });

      // Inject the new menus
      menus.forEach((menu) => {
        if (!existingLabels.has(menu.label)) {
          const href = menu.path.startsWith('/') || menu.path.startsWith('#') || menu.path.startsWith('http') 
            ? menu.path 
            : `/${menu.path}`;
            
          navContainer.append(`<a href="${href}" class="${className}">${menu.label}</a>`);
        }
      });

      return $.html();
    }

    // If no nav container was found, just return original html
    return html;
  } catch (error) {
    console.error("Error parsing and injecting menus into HTML:", error);
    return html; // Fallback to original html
  }
}
