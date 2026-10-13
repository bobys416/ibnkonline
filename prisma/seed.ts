// ============================================
// BUYMECART - Database Seeder
// Seeds roles, permissions, system users, categories, brands, settings, and starter products
// ============================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PERMISSIONS, SYSTEM_ROLES, ROLE_PERMISSIONS } from "../src/lib/permissions";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Buymecart Database Seeding...");

  // 1. Seed Permissions
  console.log("1. Seeding permissions...");
  const permissionMap = new Map<string, string>(); // name -> id

  for (const [key, permName] of Object.entries(PERMISSIONS)) {
    const [module] = permName.split(".");
    const permission = await prisma.permission.upsert({
      where: { name: permName },
      update: {},
      create: {
        name: permName,
        displayName: key.replace(/_/g, " ").toLowerCase(),
        module: module || "general",
        description: `Permission for ${permName}`,
      },
    });
    permissionMap.set(permName, permission.id);
  }
  console.log(`✓ Seeded ${permissionMap.size} permissions`);

  // 2. Seed Roles
  console.log("2. Seeding roles and role_permissions...");
  const roleMap = new Map<string, string>(); // role name -> id

  const roleDescriptions: Record<string, string> = {
    [SYSTEM_ROLES.SUPER_ADMIN]: "Platform super administrator with unrestricted full control",
    [SYSTEM_ROLES.ADMIN]: "Store administrative user with full operational access",
    [SYSTEM_ROLES.PRODUCT_MANAGER]: "Manages product lifecycle, approvals, and categories",
    [SYSTEM_ROLES.PRODUCT_EDITOR]: "Drafts and edits catalog product details",
    [SYSTEM_ROLES.CATALOGUE_APPROVER]: "Reviews and approves submitted products",
    [SYSTEM_ROLES.INVENTORY_MANAGER]: "Manages warehouse and stock levels",
    [SYSTEM_ROLES.ORDER_MANAGER]: "Oversees order fulfillments, tracking, and cancellation",
    [SYSTEM_ROLES.CUSTOMER_SUPPORT]: "Handles customer escalations and review moderation",
    [SYSTEM_ROLES.FINANCE_OPS]: "Financial operations, refunds, and accounting reconciliations",
    [SYSTEM_ROLES.ANALYST]: "View access to operational analytics and reports",
    [SYSTEM_ROLES.CUSTOMER]: "Standard registered shopping customer",
  };

  for (const [key, roleName] of Object.entries(SYSTEM_ROLES)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {
        displayName: key.replace(/_/g, " "),
        description: roleDescriptions[roleName] || roleName,
      },
      create: {
        name: roleName,
        displayName: key.replace(/_/g, " "),
        description: roleDescriptions[roleName] || roleName,
        isSystem: true,
      },
    });
    roleMap.set(roleName, role.id);

    // Link role permissions
    const assignedPerms = ROLE_PERMISSIONS[roleName] || [];
    for (const permName of assignedPerms) {
      const permId = permissionMap.get(permName);
      if (permId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permId,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permId,
          },
        });
      }
    }
  }
  console.log(`✓ Seeded ${roleMap.size} system roles with permissions`);

  // 3. Seed Users
  console.log("3. Seeding seed users...");
  const passwordHash = await bcrypt.hash("Admin@123456", 12);
  const customerPasswordHash = await bcrypt.hash("Customer@123456", 12);

  const superAdminRole = roleMap.get(SYSTEM_ROLES.SUPER_ADMIN);
  const productManagerRole = roleMap.get(SYSTEM_ROLES.PRODUCT_MANAGER);
  const customerRole = roleMap.get(SYSTEM_ROLES.CUSTOMER);

  // Super Admin
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@buymecart.com" },
    update: {
      status: "ACTIVE",
      emailVerified: true,
    },
    create: {
      email: "admin@buymecart.com",
      fullName: "Super Admin",
      passwordHash,
      emailVerified: true,
      phone: "+919876543210",
      phoneVerified: true,
      status: "ACTIVE",
    },
  });

  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: superAdminRole,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRole,
      },
    });
  }

  // Product Manager
  const productManagerUser = await prisma.user.upsert({
    where: { email: "product@buymecart.com" },
    update: {
      status: "ACTIVE",
      emailVerified: true,
    },
    create: {
      email: "product@buymecart.com",
      fullName: "Product Manager",
      passwordHash,
      emailVerified: true,
      phone: "+919876543211",
      phoneVerified: true,
      status: "ACTIVE",
    },
  });

  if (productManagerRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: productManagerUser.id,
          roleId: productManagerRole,
        },
      },
      update: {},
      create: {
        userId: productManagerUser.id,
        roleId: productManagerRole,
      },
    });
  }

  // Customer
  const demoCustomer = await prisma.user.upsert({
    where: { email: "customer@buymecart.com" },
    update: {
      status: "ACTIVE",
      emailVerified: true,
    },
    create: {
      email: "customer@buymecart.com",
      fullName: "Aarav Sharma",
      passwordHash: customerPasswordHash,
      emailVerified: true,
      phone: "+919876543212",
      phoneVerified: true,
      status: "ACTIVE",
    },
  });

  if (customerRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: demoCustomer.id,
          roleId: customerRole,
        },
      },
      update: {},
      create: {
        userId: demoCustomer.id,
        roleId: customerRole,
      },
    });
  }
  console.log("✓ Seeded Admin, Product Manager, and Demo Customer");

  // 4. Seed Categories
  console.log("4. Seeding categories...");
  const categoriesData = [
    {
      name: "Electronics",
      slug: "electronics",
      description: "Smartphones, laptops, audio accessories, and smart devices",
      sortOrder: 1,
      children: [
        { name: "Smartphones & Tablets", slug: "smartphones-tablets", sortOrder: 1 },
        { name: "Laptops & Computers", slug: "laptops-computers", sortOrder: 2 },
        { name: "Audio & Headphones", slug: "audio-headphones", sortOrder: 3 },
        { name: "Wearables & Smartwatches", slug: "wearables-smartwatches", sortOrder: 4 },
      ],
    },
    {
      name: "Fashion & Apparel",
      slug: "fashion",
      description: "Men's, Women's, and Kids' wear, footwear and ethnic attire",
      sortOrder: 2,
      children: [
        { name: "Men's Clothing", slug: "mens-clothing", sortOrder: 1 },
        { name: "Women's Fashion", slug: "womens-fashion", sortOrder: 2 },
        { name: "Footwear", slug: "footwear", sortOrder: 3 },
      ],
    },
    {
      name: "Home & Kitchen",
      slug: "home-kitchen",
      description: "Cookware, home decor, appliances, and furnishings",
      sortOrder: 3,
      children: [
        { name: "Kitchen Appliances", slug: "kitchen-appliances", sortOrder: 1 },
        { name: "Home Decor", slug: "home-decor", sortOrder: 2 },
      ],
    },
    {
      name: "Beauty & Personal Care",
      slug: "beauty-personal-care",
      description: "Skincare, haircare, fragrances, and grooming",
      sortOrder: 4,
      children: [],
    },
  ];

  const categoryMap = new Map<string, string>(); // slug -> id

  for (const cat of categoriesData) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoryMap.set(cat.slug, parent.id);

    for (const child of cat.children) {
      const sub = await prisma.category.upsert({
        where: { slug: child.slug },
        update: { name: child.name, sortOrder: child.sortOrder, parentId: parent.id },
        create: {
          name: child.name,
          slug: child.slug,
          sortOrder: child.sortOrder,
          parentId: parent.id,
          isActive: true,
        },
      });
      categoryMap.set(child.slug, sub.id);
    }
  }
  console.log(`✓ Seeded ${categoryMap.size} categories and subcategories`);

  // 5. Seed Brands
  console.log("5. Seeding brands...");
  const brandsData = [
    { name: "Apple", slug: "apple", description: "Think Different — premium smartphones, tablets, and computing" },
    { name: "Samsung", slug: "samsung", description: "Next-gen electronics and smartphones" },
    { name: "Sony", slug: "sony", description: "Industry-leading audio and gaming gear" },
    { name: "Nike", slug: "nike", description: "Just Do It — performance athletic footwear & sportswear" },
    { name: "Philips", slug: "philips", description: "Innovative home appliances and personal care" },
    { name: "boAt", slug: "boat", description: "India's #1 earwear brand for high bass sound" },
  ];

  const brandMap = new Map<string, string>(); // slug -> id
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, description: b.description },
      create: {
        name: b.name,
        slug: b.slug,
        description: b.description,
        isActive: true,
      },
    });
    brandMap.set(b.slug, brand.id);
  }
  console.log(`✓ Seeded ${brandMap.size} brands`);

  // 6. Seed Application Settings
  console.log("6. Seeding application settings...");
  const settingsData = [
    {
      key: "store.name",
      group: "general",
      label: "Store Name",
      value: "Buymecart India",
    },
    {
      key: "store.currency",
      group: "general",
      label: "Currency",
      value: "INR",
    },
    {
      key: "shipping.default_fee_paise",
      group: "shipping",
      label: "Standard Shipping Fee (Paise)",
      value: 4900, // ₹49
    },
    {
      key: "shipping.free_threshold_paise",
      group: "shipping",
      label: "Free Shipping Minimum (Paise)",
      value: 49900, // ₹499
    },
    {
      key: "payment.cod_enabled",
      group: "payment",
      label: "Enable Cash on Delivery",
      value: true,
    },
    {
      key: "payment.razorpay_enabled",
      group: "payment",
      label: "Enable Razorpay Payments",
      value: true,
    },
  ];

  for (const s of settingsData) {
    await prisma.applicationSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, label: s.label, group: s.group },
      create: {
        key: s.key,
        value: s.value,
        group: s.group,
        label: s.label,
      },
    });
  }
  console.log("✓ Seeded application settings");

  // 7. Seed Featured Products & Variants
  console.log("7. Seeding catalog products...");
  const products = [
    {
      name: "Apple iPhone 15 (128 GB) - Midnight Black",
      slug: "apple-iphone-15-128gb-midnight-black",
      sku: "IPHONE-15-128-BLK",
      categoryId: categoryMap.get("smartphones-tablets") || categoryMap.get("electronics")!,
      brandId: brandMap.get("apple"),
      mrpPaise: 7990000, // ₹79,900
      sellingPricePaise: 7199900, // ₹71,999
      costPricePaise: 6500000,
      description: "Experience Dynamic Island, 48MP main camera, and USB-C connectivity on iPhone 15.",
      shortDescription: "A16 Bionic chip, 48MP main camera, Dynamic Island.",
      status: "PUBLISHED" as const,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      avgRating: 4.8,
      reviewCount: 342,
      variants: [
        {
          sku: "IPHONE-15-128-BLK-VAR",
          name: "128 GB / Midnight Black",
          color: "Midnight Black",
          capacity: "128 GB",
          stockQuantity: 45,
          mrpPaise: 7990000,
          sellingPricePaise: 7199900,
        },
        {
          sku: "IPHONE-15-256-BLU-VAR",
          name: "256 GB / Blue",
          color: "Blue",
          capacity: "256 GB",
          stockQuantity: 28,
          mrpPaise: 8990000,
          sellingPricePaise: 8199900,
        },
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
          altText: "iPhone 15 front view",
          isPrimary: true,
        },
      ],
    },
    {
      name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      slug: "sony-wh-1000xm5-wireless-noise-cancelling-headphones",
      sku: "SONY-WH1000XM5-SLV",
      categoryId: categoryMap.get("audio-headphones") || categoryMap.get("electronics")!,
      brandId: brandMap.get("sony"),
      mrpPaise: 3499000, // ₹34,990
      sellingPricePaise: 2699000, // ₹26,990
      costPricePaise: 2200000,
      description: "Industry leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life.",
      shortDescription: "Premium ANC over-ear headphones with 30-hour battery life.",
      status: "PUBLISHED" as const,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      avgRating: 4.9,
      reviewCount: 198,
      variants: [
        {
          sku: "SONY-WH1000XM5-BLK-VAR",
          name: "Black",
          color: "Black",
          stockQuantity: 30,
          mrpPaise: 3499000,
          sellingPricePaise: 2699000,
        },
        {
          sku: "SONY-WH1000XM5-SLV-VAR",
          name: "Silver",
          color: "Silver",
          stockQuantity: 15,
          mrpPaise: 3499000,
          sellingPricePaise: 2699000,
        },
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
          altText: "Sony WH-1000XM5 Headphones",
          isPrimary: true,
        },
      ],
    },
    {
      name: "Nike Air Zoom Pegasus 40 Running Shoes",
      slug: "nike-air-zoom-pegasus-40-running-shoes",
      sku: "NIKE-PEGASUS-40",
      categoryId: categoryMap.get("footwear") || categoryMap.get("fashion")!,
      brandId: brandMap.get("nike"),
      mrpPaise: 1189500, // ₹11,895
      sellingPricePaise: 899900, // ₹8,999
      costPricePaise: 600000,
      description: "A springy ride for any run with Nike React technology and two Zoom Air units.",
      shortDescription: "Responsive road running shoes with breathable engineered mesh.",
      status: "PUBLISHED" as const,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      avgRating: 4.7,
      reviewCount: 88,
      variants: [
        {
          sku: "NIKE-PEG-40-UK8",
          name: "UK 8 / White-Black",
          size: "UK 8",
          color: "White/Black",
          stockQuantity: 20,
          mrpPaise: 1189500,
          sellingPricePaise: 899900,
        },
        {
          sku: "NIKE-PEG-40-UK9",
          name: "UK 9 / White-Black",
          size: "UK 9",
          color: "White/Black",
          stockQuantity: 12,
          mrpPaise: 1189500,
          sellingPricePaise: 899900,
        },
      ],
      images: [
        {
          url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
          altText: "Nike Air Zoom Pegasus 40",
          isPrimary: true,
        },
      ],
    },
  ];

  for (const prod of products) {
    const createdProduct = await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {
        name: prod.name,
        sellingPricePaise: prod.sellingPricePaise,
        mrpPaise: prod.mrpPaise,
        status: prod.status,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku,
        categoryId: prod.categoryId,
        brandId: prod.brandId,
        mrpPaise: prod.mrpPaise,
        sellingPricePaise: prod.sellingPricePaise,
        costPricePaise: prod.costPricePaise,
        description: prod.description,
        shortDescription: prod.shortDescription,
        status: prod.status,
        isFeatured: prod.isFeatured,
        isBestSeller: prod.isBestSeller,
        isNewArrival: prod.isNewArrival,
        avgRating: prod.avgRating,
        reviewCount: prod.reviewCount,
        publishedAt: new Date(),
      },
    });

    for (const v of prod.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          stockQuantity: v.stockQuantity,
          sellingPricePaise: v.sellingPricePaise,
          mrpPaise: v.mrpPaise,
        },
        create: {
          productId: createdProduct.id,
          sku: v.sku,
          name: v.name,
          color: v.color,
          size: (v as any).size,
          capacity: (v as any).capacity,
          stockQuantity: v.stockQuantity,
          mrpPaise: v.mrpPaise,
          sellingPricePaise: v.sellingPricePaise,
        },
      });
    }

    for (const img of prod.images) {
      const existingImg = await prisma.productImage.findFirst({
        where: { productId: createdProduct.id, url: img.url },
      });
      if (!existingImg) {
        await prisma.productImage.create({
          data: {
            productId: createdProduct.id,
            url: img.url,
            altText: img.altText,
            isPrimary: img.isPrimary,
          },
        });
      }
    }
  }

  console.log("✓ Seeded featured products, variants, and images");

  // 8. Seed Hero Banners
  console.log("8. Seeding banners...");
  await prisma.banner.createMany({
    data: [
      {
        title: "Mega Electronics Fest 2026",
        subtitle: "Up to 40% OFF on Flagship Smartphones & Noise Cancelling Audio",
        imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80",
        linkUrl: "/categories/electronics",
        position: "hero",
        sortOrder: 1,
        isActive: true,
      },
      {
        title: "Elevate Your Style",
        subtitle: "Premium footwear & ethnic collections with Free Delivery across India",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
        linkUrl: "/categories/fashion",
        position: "hero",
        sortOrder: 2,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✓ Seeded banners");

  console.log("\n🎉 Database Seeding Completed Successfully!");
  console.log("--------------------------------------------------");
  console.log("Super Admin: admin@buymecart.com / Admin@123456");
  console.log("Product Manager: product@buymecart.com / Admin@123456");
  console.log("Customer: customer@buymecart.com / Customer@123456");
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
