import { usePath } from "@/context/PathProvider";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
function LocationIndicator() {
  const path = usePath();
  const pathArray = path.path.split("/");
  return (
    <div className="lg:col-[2_/_3] pt-3 pl-3">
      <Breadcrumb>
        <BreadcrumbList>
          {pathArray.map((part) => {
            if (part !== "/") {
              return (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink>{part}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              );
            }
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
export default LocationIndicator;
