import DOMPurify from "isomorphic-dompurify";

// Allowlist: basic text formatting + links + images. No script-capable
// tags/attrs (no <style>, <svg>, on*, iframe, object, etc.) ever reach here.
const ALLOWED_TAGS = ["b", "i", "u", "em", "strong", "br", "a", "span", "img"];
const ALLOWED_ATTR = ["href", "src", "alt", "style"];

// Only https/mailto links and image sources — blocks javascript:, data:,
// and plain http: (mixed content / easier MITM).
const SAFE_URI_REGEXP = /^(?:https:|mailto:)/i;

// `style` may only set color/font-size to a safe-looking value. This blocks
// url(), expression(), position/z-index overlay tricks, @import, etc.
const SAFE_STYLE_REGEXP =
  /^(?:\s*(?:color\s*:\s*(?:#[0-9a-f]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|[a-z]+)|font-size\s*:\s*(?:[0-9]{1,2}(?:\.\d+)?(?:px|pt|em|rem)|small|medium|large))\s*;?\s*)+$/i;

const MAX_IMAGES_PER_FIELD = 5;

let hooksRegistered = false;
let imageCount = 0;

function registerHooks() {
  if (hooksRegistered) return;
  hooksRegistered = true;

  // Cap the number of images a single field can render, so a profile can't
  // be turned into a page-freezing wall of <img> tags for anyone viewing it.
  DOMPurify.addHook("uponSanitizeElement", (_node, data) => {
    if (data.tagName === "img") {
      imageCount += 1;
      if (imageCount > MAX_IMAGES_PER_FIELD) {
        data.allowedTags.img = false;
      }
    }
  });

  DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName === "style" && !SAFE_STYLE_REGEXP.test(data.attrValue)) {
      data.keepAttr = false;
      return;
    }
    // DOMPurify allows data: URIs on <img src> by design (bypassing
    // ALLOWED_URI_REGEXP), regardless of ALLOWED_URI_REGEXP — closing that
    // explicitly so images stay restricted to https/mailto like links.
    if (data.attrName === "src" || data.attrName === "href") {
      const normalized = data.attrValue.replace(/[\x00-\x20]+/g, "").toLowerCase();
      if (normalized.startsWith("data:")) {
        data.keepAttr = false;
      }
    }
  });

  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      // Prevent tabnabbing and stop the profile owner's link from
      // controlling the opener tab; nofollow/ugc discourages link spam.
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer nofollow ugc");
    }
    if (node.tagName === "IMG") {
      // Never trust attacker-supplied width/height (layout abuse) — clamp
      // via CSS instead. no-referrer stops the profile page URL and cookies
      // headers from leaking to third-party image hosts (tracking pixels).
      node.removeAttribute("width");
      node.removeAttribute("height");
      node.setAttribute("referrerpolicy", "no-referrer");
      node.setAttribute("loading", "lazy");
      node.setAttribute("class", "max-w-full h-auto align-middle");
    }
  });
}

export function sanitizeProfileHtml(dirty: string): string {
  registerHooks();
  imageCount = 0;

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: SAFE_URI_REGEXP,
    ALLOW_DATA_ATTR: false,
  });
}
