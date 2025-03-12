'use client';


import { usePathname } from "next/navigation";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from "@/components/ui/breadcrumb";
import React from "react";

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Split the pathname and filter out empty strings
  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  // Create breadcrumb items
  const breadcrumbItems = [
    // Always start with the home/main label
    { 
      label: 'BCMIMS', 
      href: '/' 
    },
    // Add dynamic path segments
    ...pathSegments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
      href: `/${pathSegments.slice(0, index + 1).join('/')}`
    }))
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            {index < breadcrumbItems.length - 1 ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}