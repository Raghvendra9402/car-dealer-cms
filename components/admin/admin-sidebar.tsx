"use client";

import { useCallback, useState } from "react";
import type { Variants } from "motion";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import {
  CarFrontIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { ActiveLink } from "../shared/active-link";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    name: "Listings",
    href: "/listings",
    icon: CarFrontIcon,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: UsersIcon,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
];

export function AdminSidebar() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const handleSidebarHover = useCallback((expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  }, []);

  const sidebarVariants: Variants = {
    expanded: { width: 256 },
    collapsed: { width: "fit-content" },
  };

  const menuTextVariants: Variants = {
    expanded: {
      opacity: 1,
      width: "auto",
      marginLeft: 10,
    },
    collapsed: { opacity: 0, width: 0 },
  };

  const logoVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      className="bg-primary overflow-hidden flex flex-col"
      animate={isSidebarExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      initial="collapsed"
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      onMouseEnter={() => handleSidebarHover(true)}
      onMouseLeave={() => handleSidebarHover(false)}
    >
      <div className="flex flex-col grow px-4">
        <Link href={"/"}>
          <div className="relative h-15 w-full">
            <AnimatePresence initial={false} mode="wait">
              {isSidebarExpanded ? (
                <motion.div
                  key={"expanded-logo"}
                  className="absolute inset-0"
                  variants={logoVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{
                    duration: 0.4,
                  }}
                >
                  <Image
                    src={"/logo-title.svg"}
                    alt="logo"
                    fill
                    className="object-contain object-left"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={"collapsed-logo"}
                  className="absolute inset-0"
                  variants={logoVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{
                    duration: 0.1,
                  }}
                >
                  <Image
                    src={"/logo.svg"}
                    alt="logo"
                    fill
                    className="object-contain object-left"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>
        <nav className="flex flex-col gap-2">
          {navigation.map((item) => (
            <ActiveLink
              href={item.href}
              key={item.name}
              className="flex items-center p-2 rounded-lg transition-colors duration-200 w-full cursor-pointer"
            >
              <div className="flex items-center justify-center">
                <item.icon aria-hidden className="size-5 shrink-0" />
                <motion.span
                  variants={menuTextVariants}
                  animate={isSidebarExpanded ? "expanded" : "collapsed"}
                  initial="collapsed"
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.name}
                </motion.span>
              </div>
            </ActiveLink>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}
