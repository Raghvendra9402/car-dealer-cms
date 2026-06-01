import Image from "next/image";
import Link from "next/link";
import {
  SiInstagram,
  SiMeta,
  SiX,
  SiSnapchat,
} from "@icons-pack/react-simple-icons";
import { NewsLetterForm } from "./news-letter-form";

const socialLinks = [
  {
    id: 1,
    href: "https://instagram.com",
    icon: (
      <SiInstagram className="size-5 text-gray-600 hover:text-primary transition-colors" />
    ),
  },
  {
    id: 2,
    href: "https://facebook.com",
    icon: (
      <SiMeta className="size-5 text-gray-600 hover:text-primary transition-colors" />
    ),
  },
  {
    id: 3,
    href: "https://x.com",
    icon: (
      <SiX className="size-5 text-gray-600 hover:text-primary transition-colors" />
    ),
  },
  {
    id: 4,
    href: "https://snapchat.com",
    icon: (
      <SiSnapchat className="size-5 text-gray-600 hover:text-primary transition-colors" />
    ),
  },
];

const navLinks = [
  {
    id: 1,
    href: "/",
    label: "Home",
  },
  {
    id: 2,
    href: "/inventory",
    label: "Inventory",
  },
  {
    id: 3,
    href: "/favourites",
    label: "Favourites",
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-200 px-8 md:px-10 py-8">
      <div className=" mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Link href={"/"} className="flex items-center">
              <Image
                src={"/logo.svg"}
                alt="RS MOTORS"
                width={35}
                height={35}
                className="md:hidden"
              />
              <Image
                src={"/logo-title.svg"}
                alt="RS MOTORS"
                width={180}
                height={180}
                className="hidden md:block"
              />
            </Link>
          </div>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Link href={social.href} key={social.id}>
                {social.icon}
              </Link>
            ))}
          </div>
          <div className="space-y-2">
            <ul className="space-y-1">
              {navLinks.map((nl) => (
                <li key={nl.id}>
                  <Link href={nl.href}>{nl.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-8 text-center text-gray-700">
          <h4 className="text-lg font-bold text-primary">Company Info</h4>
          <p>RS Motors Pvt. Ltd.</p>
          <p>GSTIN: 12ABCDE3456F1Z5</p>
          <p>Trusted marketplace for buying quality vehicles.</p>
        </div>
        <div className="md:ml-auto">
          <NewsLetterForm />
        </div>
      </div>
    </footer>
  );
}
