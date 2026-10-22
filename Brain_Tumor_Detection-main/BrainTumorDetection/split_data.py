import os
import shutil

BRISC_DIR = "brisc_raw"     
DEST_DIR = "data"

print("📦 Organizing classification data...")

for split in ["train", "test"]:
    src_split = os.path.join(BRISC_DIR, "classification_task", split)
    dest_split = os.path.join(DEST_DIR, "classification", split)

    for cls in os.listdir(src_split):
        src_cls = os.path.join(src_split, cls)
        dest_cls = os.path.join(dest_split, cls)

        os.makedirs(dest_cls, exist_ok=True)

        for img in os.listdir(src_cls):
            shutil.copy(
                os.path.join(src_cls, img),
                os.path.join(dest_cls, img)
            )

        print(f"  ✔ {cls} ({split})")


print("\n🧠 Organizing segmentation data...")
for split in ["train", "test"]:
    src_img = os.path.join(
        BRISC_DIR, "segmentation_task", split, "images"
    )
    src_mask = os.path.join(
        BRISC_DIR, "segmentation_task", split, "masks"
    )

    dest_img = os.path.join(
        DEST_DIR, "segmentation", split, "images"
    )
    dest_mask = os.path.join(
        DEST_DIR, "segmentation", split, "masks"
    )

    os.makedirs(dest_img, exist_ok=True)
    os.makedirs(dest_mask, exist_ok=True)

    for img in os.listdir(src_img):
        shutil.copy(
            os.path.join(src_img, img),
            os.path.join(dest_img, img)
        )

    for mask in os.listdir(src_mask):
        shutil.copy(
            os.path.join(src_mask, mask),
            os.path.join(dest_mask, mask)
        )

    print(f"  ✔ segmentation ({split})")