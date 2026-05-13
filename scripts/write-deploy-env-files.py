#!/usr/bin/env python3
"""יוצר את /tmp/stack.env (APP_IMAGE) ואת /tmp/.env.prod מתוך משתני הסביבה ב-GitHub Actions."""

import os
import pathlib
import sys


def main() -> None:
    if len(sys.argv) != 3:
        print("usage: write-deploy-env-files.py out_stack.env out_env.prod", file=sys.stderr)
        sys.exit(2)
    stack_path, prod_path = sys.argv[1], sys.argv[2]

    app_image = os.environ.get("APP_IMAGE_VALUE", "").strip()
    if not app_image:
        print("APP_IMAGE_VALUE חסר", file=sys.stderr)
        sys.exit(2)

    pathlib.Path(stack_path).write_text(f"APP_IMAGE={app_image}\n", encoding="utf-8")

    mongo = (os.environ.get("MONGODB_URI") or "").strip() or "mongodb://mongo:27017/parent-guide"
    site = os.environ["NEXT_PUBLIC_SITE_URL"].strip()
    npub = os.environ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"].strip()
    csec = os.environ["CLERK_SECRET_KEY"].strip()

    lines = [
        f"MONGODB_URI={mongo}",
        f"NEXT_PUBLIC_SITE_URL={site}",
        f"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={npub}",
        f"CLERK_SECRET_KEY={csec}",
    ]
    optional = [
        ("CLOUDINARY_CLOUD_NAME", "CLOUDINARY_CLOUD_NAME"),
        ("CLOUDINARY_API_KEY", "CLOUDINARY_API_KEY"),
        ("CLOUDINARY_API_SECRET", "CLOUDINARY_API_SECRET"),
        ("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET", "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"),
    ]
    for key, env_key in optional:
        val = (os.environ.get(env_key) or "").strip()
        if val:
            lines.append(f"{key}={val}")

    pathlib.Path(prod_path).write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
