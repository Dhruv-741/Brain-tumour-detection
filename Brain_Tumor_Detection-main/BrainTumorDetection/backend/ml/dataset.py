from torchvision import transforms, datasets
from torch.utils.data import DataLoader, Subset
from sklearn.model_selection import train_test_split

def get_dataloaders(data_dir, batch_size=16, val_split=0.2):
    """
    Modular data ingestion with standardized medical-grade transforms.
    Includes an automatic training/validation split if not pre-split.
    """
    
    # Define a clean transforms pipeline
    medical_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ToTensor(),
        # Advanced statistics for MRI normalization
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    val_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    # 1. Load the full dataset
    full_dataset = datasets.ImageFolder(root=data_dir, transform=medical_transforms)
    
    # 2. Extract targets for stratified split
    targets = full_dataset.targets
    train_idx, val_idx = train_test_split(
        list(range(len(targets))), 
        test_size=val_split, 
        stratify=targets, 
        random_state=42
    )

    # 3. Create subsets
    train_dataset = Subset(full_dataset, train_idx)
    # Apply slightly different transforms to validation (no augmentation)
    val_dataset = Subset(datasets.ImageFolder(root=data_dir, transform=val_transforms), val_idx)

    # 4. Initialize Loaders
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    print(f"📊 Dataset Split Complete: {len(train_loader.dataset)} Train | {len(val_loader.dataset)} Validation")
    return train_loader, val_loader
