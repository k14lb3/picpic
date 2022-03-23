export const isValidEmail = (email) =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

export const isValidUsername = (username) => /^[a-zA-Z0-9\_\.]+$/.test(username);

export const isValidImageFile = (filename) =>
  /.*\.(jpg|jpeg|png)/i.test(filename);

export const resizeImage = (imgFile, width = '150', height = '150') =>
  new Promise((resolve, reject) => {
    if (!imgFile) return;

    if (!isValidImageFile(imgFile.name)) return;

    const reader = new FileReader();

    const img = document.createElement('img');
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL(imgFile.type));
    };

    reader.readAsDataURL(imgFile);
  });
