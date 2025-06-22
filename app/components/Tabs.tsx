import React, { ReactNode, ReactElement, useState, useEffect } from "react";

interface TabProps {
  label: string;
  children: ReactNode;
}

interface TabsProps {
  children: ReactNode[];
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const validChildren = children.filter(
    (child) => React.isValidElement(child)
  ) as ReactElement<TabProps>[];

  const defaultTab = "En Attente";

  // On initialise avec une valeur vide, on chargera via useEffect
  const [activeTab, setActiveTab] = useState<string>("");

  // Au montage, lire localStorage ou définir par défaut "En Attente"
  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(storedTab);
    } else {
      // Si rien dans localStorage, on met "En Attente" par défaut
      const exists = validChildren.some(child => child.props.label === defaultTab);
      const initialTab = exists ? defaultTab : validChildren[0]?.props?.label || "";
      setActiveTab(initialTab);
      localStorage.setItem("activeTab", initialTab);
    }
  }, [validChildren]);

  const handleClick = (e: React.MouseEvent, newActiveTab: string) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
    localStorage.setItem("activeTab", newActiveTab);
  };

  if (!activeTab) return null; // Eviter d'afficher avant init

  return (
    <div className="w-full">
      <div className="flex border-b border-base-200  space-x-4 ">
        {validChildren.map((child) => (
          <button
            key={child.props.label}
            className={` cursor-pointer ${
              activeTab === child.props.label ? "border-b-2 border-primary " : ""
            }   font-medium py-2 w-fit `}
            onClick={(e) => handleClick(e, child.props.label)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {validChildren.map((child) => {
          if (child.props.label === activeTab) {
            return <div key={child.props.label}>{child.props.children}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
};

const Tab: React.FC<TabProps> = ({ label, children }) => {
  return <div>{children}</div>;
};

export { Tabs, Tab };
