import{b as a,j as s}from"./index-Cw4bXZwb.js";const l=()=>{const{devices:t}=a();return s.jsx("div",{className:"py-6",children:s.jsxs("div",{className:"max-w-7xl mx-auto px-4",children:[s.jsx("h1",{className:"text-3xl font-bold mb-6 text-center",children:"Connected Devices"}),s.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:t.map(e=>s.jsxs("div",{className:"max-w-sm rounded-lg p-2 overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300",children:[s.jsx("h2",{className:"text-md mb-2",children:e.id}),s.jsxs("div",{className:"flex justify-between",children:[s.jsxs("h2",{className:"text-md mb-2",children:["ScreenId: ",e.screenId]}),s.jsxs("p",{className:"text-sm",children:["Status: ",s.jsx("span",{className:`font-semibold ${e.status==="Online"?"text-green-600":"text-red-600"}`,children:e.status})]})]})]},e.id))})]})})};export{l as default};
