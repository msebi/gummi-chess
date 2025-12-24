import React from 'react';
import ReactDescriptionComponent from './ReactDescriptionComponent';
import ReactLogoComponent from './icons/ReactLogoComponent';

const ReactSiteDescriptionComponent: React.FC = () => {
  return (
    <section className="w-full bg-blue-50">
      <div className="container mx-auto flex flex-wrap"> {/* flex-wrap for responsiveness */}
        <div className="w-full md:w-1/2">
          <ReactDescriptionComponent title="Sharpen Your Chess Skills Now">
              Whether you&apos;re a pro or just starting out, Gummi&apos;s chess skills are a must have. 
          </ReactDescriptionComponent>
        </div>
        <div className="w-full md:w-1/2">
          {/* Using a different image to show flexibility */}
          <ReactLogoComponent             
            // TODO: change url
            logoUrl="https://via.placeholder.com/600x400/0000FF/FFFFFF?text=Inspiration"
            alignment="justify-center items-center"
            className="h-full"
            width={600}
            height={400}
          />
        </div>
      </div>
    </section>
  );
};

export default ReactSiteDescriptionComponent;
