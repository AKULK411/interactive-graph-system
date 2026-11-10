import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function FormLogic(){
    const KEY = "app:json-data";

  
  const [data, setData] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; }
  });

    async function handleSubmit(e) {
    e.preventDefault();
    const input = e.currentTarget.elements.file;
    const file = input.files[0];
    input.value = "";                              
    if (!file) return;

    const parsed = JSON.parse(await file.text());
    sessionStorage.setItem(KEY, JSON.stringify(parsed));
    setData(parsed);
      
  }


  

  return (<>
      <form onSubmit={handleSubmit}>
      <input type="file" name="file" accept="application/json,.json" />
      <button type="submit">Загрузить</button>
      </form>
      
        </>)

}
