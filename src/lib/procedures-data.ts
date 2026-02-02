import facialImage from "../assets/REFINE/facial.jpeg";
import bodyContouringImage from "../assets/REFINE/body-contouring.jpeg";
import breastImage from "../assets/REFINE/breast.jpeg";
import hairImage from "../assets/REFINE/hair.webp";

export const procedures = [
  {
    id: "facial",
    slug: "facial-procedures",
    name: "Facial Procedures",
    image: facialImage,
    description: "Rejuvenate your face with our expert facial procedures including facelifts, rhinoplasty, and more.",
    fullDescription: "Our facial procedures are designed to help you achieve a more youthful, refreshed appearance. Whether you're looking to address signs of aging, reshape your nose, or enhance your facial features, our expert surgeons use the latest techniques to deliver natural-looking results.",
    features: ["Facelift & Neck Lift", "Rhinoplasty", "Blepharoplasty", "Brow Lift", "Chin Augmentation"],
    benefits: [
      "Restore youthful contours to your face",
      "Reduce the appearance of wrinkles and sagging",
      "Improve facial symmetry and balance",
      "Boost self-confidence with natural-looking results"
    ],
  },
  {
    id: "body",
    slug: "body-contouring",
    name: "Body Contouring",
    image: bodyContouringImage,
    description: "Achieve your ideal body shape with liposuction, tummy tucks, and body lift procedures.",
    fullDescription: "Body contouring procedures help you achieve the silhouette you've always wanted. Our surgeons specialize in removing excess fat and skin, tightening muscles, and reshaping specific areas of your body for a more toned and proportionate appearance.",
    features: ["Liposuction", "Tummy Tuck", "Body Lift", "Arm Lift", "Thigh Lift"],
    benefits: [
      "Remove stubborn fat deposits resistant to diet and exercise",
      "Eliminate excess skin after weight loss",
      "Achieve a more toned, sculpted appearance",
      "Improve body proportion and contour"
    ],
  },
  {
    id: "breast",
    slug: "breast-surgery",
    name: "Breast Surgery",
    image: breastImage,
    description: "Enhance your silhouette with breast augmentation, reduction, or lift procedures.",
    fullDescription: "Our breast surgery options are tailored to meet your individual goals, whether you want to enhance, reduce, or lift your breasts. Using the latest surgical techniques and implant options, we help you achieve beautiful, natural-looking results.",
    features: ["Breast Augmentation", "Breast Reduction", "Breast Lift", "Breast Reconstruction", "Gynecomastia"],
    benefits: [
      "Achieve your desired breast size and shape",
      "Improve breast symmetry",
      "Restore breast volume lost due to aging or pregnancy",
      "Relieve physical discomfort from overly large breasts"
    ],
  },
  {
    id: "skin",
    slug: "skin-and-hair",
    name: "Skin & Hair",
    image: hairImage,
    description: "Restore your natural beauty with skin treatments and hair restoration solutions.",
    fullDescription: "Our skin and hair treatments address a wide range of concerns, from acne scars and sun damage to hair loss. Using advanced technologies and proven techniques, we help you achieve healthier, more radiant skin and fuller, thicker hair.",
    features: ["Chemical Peels", "Laser Treatments", "Skin Tightening", "PRP Therapy", "Scar Revision"],
    benefits: [
      "Improve skin texture and tone",
      "Reduce the appearance of scars and blemishes",
      "Stimulate collagen production for firmer skin",
      "Address early signs of aging non-surgically"
    ],
  },
  {
    id: "hair",
    slug: "hair-transplants",
    name: "Hair Transplants",
    image: hairImage,
    description: "Advanced hair transplant techniques for natural-looking, permanent results.",
    fullDescription: "Hair loss can significantly impact your confidence and self-image. Our advanced hair transplant procedures use state-of-the-art techniques to restore your hairline and density, giving you natural-looking, permanent results.",
    features: ["FUE Transplant", "FUT Transplant", "Hairline Restoration", "Beard Transplant", "Eyebrow Restoration"],
    benefits: [
      "Permanent, natural-looking hair restoration",
      "Minimal scarring with advanced techniques",
      "Restore hairline and density",
      "Boost confidence with fuller hair"
    ],
  },
];

export const getProcedureBySlug = (slug: string) => {
  return procedures.find((p) => p.slug === slug);
};

export const getProcedureById = (id: string) => {
  return procedures.find((p) => p.id === id);
};
