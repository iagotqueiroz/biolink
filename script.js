function toggleMode() {
  const html = document.documentElement
  html.classList.toggle("light")
  
  //pegar a tag img
  const img = document.querySelector("#profile img")

  //substituir a imagem
  if(html.classList.contains('light')) {
    //se tiver light mode, adicionar a imagem light
    img.setAttribute('src', './assets/Avatar2.png')

    img.setAttribute(
      "alt",
      "Foto de Iago Queiroz de cabelo cacheado penteado, usando camisa branca, sentado em uma poltrona com o notebook na mesa em uma loja de porcelanatos"
    )
    } else {
      //se tiver  sem light mode, manter a imagem normal
      img.setAttribute("src", "./assets/Avatar.png")

      img.setAttribute(
        "alt",
        "Foto de Iago Queiroz de cabelo cacheado penteado, usando camisa branca e fundo cinza"
      )
    }


}