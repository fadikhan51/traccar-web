const Base64Image = ({ base64String, altText, css }) => {
    // Handle cases where the data URL prefix might already be included
    const imageSrc = base64String;

    return (
      <img 
        src={imageSrc} 
        alt={altText || "Company Logo Image"}
        className = {css ? `${css}` : {}}
      />
    );
  };
  
export default Base64Image;