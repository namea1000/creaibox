import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";
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
      description: {
        default: null,
        parseHTML: (element) => {
          const wrapper = element.closest(".image-block") || element;
          return wrapper.getAttribute("data-description") || element.getAttribute("data-description");
        },
        renderHTML: (attributes) => {
          if (!attributes.description) return {};
          return {
            "data-description": attributes.description,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, title, width, alignment, href, caption, description } = HTMLAttributes;

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
      "data-description": description || "",
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

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { state, view } = this.editor;
        const { selection } = state;

        if (!selection.empty) return false;

        const { $from } = selection;

        // Case 1: Cursor is inside the same block, immediately to the right of the image (inline case)
        const nodeBeforeCursor = $from.nodeBefore;
        if (nodeBeforeCursor && nodeBeforeCursor.type.name === this.name) {
          const imagePos = $from.pos - nodeBeforeCursor.nodeSize;
          const nodeSelection = NodeSelection.create(state.doc, imagePos);
          view.dispatch(state.tr.setSelection(nodeSelection).scrollIntoView());
          return true;
        }

        // Case 2: Cursor is at the start of a paragraph (parentOffset === 0),
        // and the previous block contains or is an image.
        if ($from.parentOffset === 0) {
          const posBeforeParent = $from.before();
          if (posBeforeParent <= 1) return false;

          const posBefore = posBeforeParent - 1;
          const resolvedPosBefore = state.doc.resolve(posBefore);
          const nodeBefore = resolvedPosBefore.nodeBefore;

          if (nodeBefore) {
            // Case 2A: Preceding node is block image
            if (nodeBefore.type.name === this.name) {
              const imagePos = posBefore - nodeBefore.nodeSize;
              const nodeSelection = NodeSelection.create(state.doc, imagePos);
              view.dispatch(state.tr.setSelection(nodeSelection).scrollIntoView());
              return true;
            }

            // Case 2B: Preceding block contains an image (e.g. paragraph wrapping an image)
            let foundImagePos = -1;
            nodeBefore.descendants((node, pos) => {
              if (node.type.name === this.name) {
                const absoluteImagePos = (posBefore - nodeBefore.nodeSize) + pos + 1;
                foundImagePos = absoluteImagePos;
              }
              return true;
            });

            if (foundImagePos !== -1) {
              const nodeSelection = NodeSelection.create(state.doc, foundImagePos);
              view.dispatch(state.tr.setSelection(nodeSelection).scrollIntoView());
              return true;
            }
          }
        }

        return false;
      },
    };
  },
});
