import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageNodeView from "./ImageNodeView";

export const CustomImage = Image.extend({
  name: "image", // Override the default image type

  addOptions() {
    return {
      ...this.parent?.(),
      setAsFeatured: null as ((src: string) => Promise<void>) | null,
    } as any;
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => {
          if (!attributes.src) return {};
          return { src: attributes.src };
        },
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => {
          if (!attributes.alt) return {};
          return { alt: attributes.alt };
        },
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) => {
          if (!attributes.title) return {};
          return { title: attributes.title };
        },
      },
      width: {
        default: "100%",
        parseHTML: (element) => {
          return element.getAttribute("width") || element.style.width || "100%";
        },
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
            style: `width: ${attributes.width}; max-width: 100%; height: auto;`,
          };
        },
      },
      alignment: {
        default: "center", // left, center, right, wide, full
        parseHTML: (element) => {
          const wrapper = element.closest(".image-block");
          if (wrapper) {
            return wrapper.getAttribute("data-alignment") || "center";
          }
          return "center";
        },
        renderHTML: (attributes) => {
          return {
            "data-alignment": attributes.alignment,
            class: `align-${attributes.alignment}`,
          };
        },
      },
      href: {
        default: null,
        parseHTML: (element) => {
          const parentA = element.closest("a");
          if (parentA) {
            return parentA.getAttribute("href");
          }
          return null;
        },
        renderHTML: (attributes) => {
          if (!attributes.href) return {};
          return {
            "data-href": attributes.href,
          };
        },
      },
      caption: {
        default: "",
        parseHTML: (element) => {
          const wrapper = element.closest(".image-block");
          if (wrapper) {
            const figcaption = wrapper.querySelector(".image-caption");
            if (figcaption) {
              return figcaption.textContent || "";
            }
            return wrapper.getAttribute("data-caption") || "";
          }
          return "";
        },
        renderHTML: (attributes) => {
          return {
            "data-caption": attributes.caption,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, title, width, alignment, href, caption } = HTMLAttributes;

    // Style for the img tag
    const imgStyle = `width: ${width || "100%"}; max-width: 100%; height: auto; display: block; margin: 0 auto;`;
    
    // Core image element representation
    const imgAttrs: Record<string, any> = {
      src,
      style: imgStyle,
    };
    if (alt) imgAttrs.alt = alt;
    if (title) imgAttrs.title = title;

    let imgNode: any = ["img", imgAttrs];

    if (href) {
      imgNode = [
        "a",
        {
          href,
          target: "_blank",
          rel: "noopener noreferrer",
          style: "display: block; width: 100%;",
        },
        imgNode,
      ];
    }

    // Wrap image block in wrapper div representing alignment
    const wrapperAttrs = {
      class: `image-block align-${alignment || "center"}`,
      "data-alignment": alignment || "center",
      "data-href": href || "",
      "data-caption": caption || "",
      style: `max-width: ${width || "100%"};`,
    };

    if (caption) {
      return [
        "div",
        wrapperAttrs,
        imgNode,
        ["figcaption", { class: "image-caption" }, caption],
      ];
    }

    return ["div", wrapperAttrs, imgNode];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
