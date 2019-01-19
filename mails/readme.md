# Grid y layouts
Los newsletters se construyen con un grid de 4 columnas con las siguientes posibles combinaciones de columnas para:

Full content ( sin gutter lateral )

1

1 1 1 1

1 3

2 2

3 1

2 1 1

1 1 2

1 2 1

El grid tiene un padding o gutter de separación constante entre columnas de 24px con un ancho máximo de 600px. Estos valores se pueden personalizar en _custom_vars.scss pero son globales a todo el proyecto. Este valor de 24px se usa además como padding para el layout con marco externo.

Tenemos 3 layouts diferentes.

- Layout con fondo background al 100% del ancho de pantalla.

- Layout con módulos sin marco exterior

- Layout con marco exterior + interior con fondo de color

Los layout se encuentran en mails/grid.html

# Anatomía de layouts
Los layouts se componen con un contenedor y un conjunto de columnas.

## Contenedores
Tenemos dos tipos de contenedores:

- _container-full

Estos contenedores llegan hasta el 100% del ancho de pantalla, son utiles para dar colores de fondo. Para añadir modulos es necesario anidar dentro un _container para centrar el contenido e iniciar el grid.

```
@@include("../../_components/_common/_layout/_container-full-start.html",{"bgcolor":"#000"})

		@@include("../../_components/_common/_layout/_container-start.html")
		
		@@include("../../_components/_common/_layout/_container-end.html")


@@include("../../_components/_common/_layout/_container-full-end.html")
```

- _container

Dan el ancho al newsletter e inician el Grid, todos los módulos han de ir dentro de estos contenedores.

```

@@include("../../_components/_common/_layout/_container-start.html")

@@include("../../_components/_common/_layout/_container-end.html")

```

# Arquitectura de carpetas

_components
	_common
		_atoms
			_btn
			_links
			_lists
			_typography
		_layout
		_organisms
			_header
			_footer
			_hero
		_utils-sass
			_grid
			_mixins
			_vars
	_pais

Todos los componentes del newsletters estáran dentro de la carpeta _componentes, si el componente se usa en todos los paises se colocará en _common, si es un componente único a un pais se coloca en _pais (_il, _es, etc.) usando la misma arquitectura que en _common pero solo para _atoms y _organisms y añadiendo el sufijo -pais tanto a nivel de css como de carpetas. De esta manera podemos tener diferentes compprtamientos para cada pais pero que a su vez son fáciles de trasplantar o duplicar de un pais a otro. Ejemplo:

	_common
		_atoms
			_links
				_links.scss -> .links{ ... }
				
					
				
	_at
		_atoms
			_links-at
			_links-at.scss -> .links-at{ ... }	


_atoms

Son los elementos que se usaran para crear los organismos ( módulos ): botones, links, listas, textos, etc. Cada vez que creemos un nuevo organismo se han de crear usando estos elementos, no creando nuevos para cada organismo. Ej: Si tenemos un módulo con un titular del tipo h1 y del tipo h2 añadimos el html td.h1 y td.h2 que se ha definido dentro del atomo _typography y no volvemos a crear un CSS nuevo para cada titular de cada módulo.

Todos los componentes se organizan en su propia carpeta con su html y scss en el interior:

_nombre-atom
	_nombre-atom.scss
	_nombre-atom.html	



_layout -> No modificar
_organisms -> Aquí irán los módulos.
_utils-sass -> Utilidades, variables de colores, escala de paddings, etc.



# Arquitectura HTML y contruyendo nuevos módulos

´´´
	<tr class="block">
      <td class="outside">
	  	<table width="100%">
	  		<tr>
	  			<td class="inner">
	  				--- Columnas ---
	  			</td>
	  		</tr>
	  	</table>
	  </td>
	</tr>  

´´´

## Clases estructurales
Las clases estructurales son aquellas que dan estructura al layout, no se han de añadir clases nuevas donde haya una de estas clases para evitar desestabilizar el sistema de layouts.

.col, .col-last-td, .col-one-td, .col-td -> Definen el ancho y el grid. No añadir clases aqui!

.outside -> Configuramos el padding bottom para añadir la separación entre bloques. En bloques con marco define el color de fondo. No añadir clases aqui!

.inner -> Se usa para dar padding interior en los módulos que tienen marco, sino no tiene uso. No añadir clases aqui!

.inside -> Configuración de padding y color de fondo para la columna, los elementos del bloque como imágenes, textos, botones, etc. van dentro de este td. Se usa para dar padding al contenido y crear parents para modificar CSS. Podemos añadir clases CSS aqui.


## Clases visuales

.block -> Añadimos la clase del nombre del modulo para definir sus propiedades, 

Dependiendo del tipo de layout, podemos tener uno con marco en los bloques, para ello añadiremos la clase border-box a la clase .block


´´´
	<tr class="block border-box">
      <td class="outside">
	  	<table width="100%">
	  		<tr>
	  			<td class="inner">
	  				--- Columnas ---
	  			</td>
	  		</tr>
	  	</table>
	  </td>
	</tr>  

´´´

Los componentes tales como botones, textos y demás son también considerados clases visuales. Todos estos elementos se crearán como átomos con estilos compartidos globales.


## Ejemplo de nuevo modulos / organismos

### Sin marco



```
	<tr class="block image-block">
      <td class="outside">
	  	<table class="row" width="100%">
	  		<tr class="sub-block">
	  			<td class="inner">

					<!--[if mso]><table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td valign="top" width="299"><![endif]-->
				
				    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="left" class="col-300">
				      <tr>
				        <td class="col-first-td">
				          <table width="100%" cellpadding="0" cellspacing="0">
				              <tr>
				              	<td class="inside text">
					              	<table width="100"%>														              	
										<tr>
											<td class="h5">PreTitular</td>
										</tr>
					              	

										<tr>
											<td class="h2">Titular</td>
										</tr>
					              	
										<tr>
											<td>
												<pLorem ipsum <strong>dolor</strong> sit amet, consectetur adipiscing elit. <sup>3</sup>></p>
											</td>
										</tr>
					              	
					              	</table>
				              	</td>
				              </tr>
				          </table>
				        </td>
				      </tr>
				    </table>
				
				    <!--[if mso]></td><td valign="top" width="300"><![endif]-->
				
				    <table width="100%" border="0" cellpadding="0" cellspacing="0" align="left" class="col-300" >
				      <tr>
				        <td class="col-last-td">
				          <table width="100%" cellpadding="0" cellspacing="0">
				              <tr>
				              	<td class="inside img">
					              	<table width="100"%>
					              		<tr>
					              			<td>
					              				<img src="http://via.placeholder.com/300x350" alt="" />
					              			</td>
					              		</tr>
					              	</table>
				              	</td>
				              </tr>
				          </table>
				        </td>
				      </tr>
				    </table>
				
				    <!--[if mso]></td></tr></table><![endif]-->
				    
	  			</td>
	  		</tr>
	  	</table>
	  </td>
	</tr>        
```

Importante recordar que para mantener coherencia y evitar la multiplicación de bugs todo organismo ha de formarse únicamente con los layouts que están en mails/grid.html

#### CSS:

Básicamente añadimos CSS de forma corriente, gulp se encargará de añadirlo dentro del html de forma automática recordando que lo aplicamos a:

- .outside
Para añadir padding inferior para separar el bloque del siguiente.
- .inside.clase
Para poder dar estilos personalizados a cada columna de contenido.

Si necesitamos añadir nombres a los diferentes contenedores internos para hacer diferencias usaremos los tr que tienen la clase "sub-block" reemplazandola por la que necesitemos:



´´´
.image-block{
	.outside{
		padding-bottom: $padding1
	}
	.text.inside{
		padding: 10px;
		background:red;		
	}
	.img.inside{
		background:blue;	
	}
}
´´´

### Con marco

#### Cambiando el marco

La personalización es identica a sin marco solo que aqui podemos aplicarlo a:

- .outside
Añadir padding inferior para separar el bloque del siguiente.
Cambiar el color del fondo del marco externo ( gris )

- .inside.clase
Dar estilos personalizados a cada columna de contenido.
Cambiar el color del fondo del marco interno ( blanco )

### Con multiples filas de diferentes columnas
Podemos crear diferentes filas apilando table.row una debajo de ora

´´´
	<tr class="block">
      <td class="outside">
	  	<table class="row" width="100%">
	  		<tr class="sub-block">
	  		...
	  		</tr>
	  	</table>
	  	<table class="row" width="100%">
	  		<tr class="sub-block">
	  		...
	  		</tr>
	  	</table>
	  	<table class="row" width="100%">
	  		<tr class="sub-block">
	  		...
	  		</tr>
	  	</table>
	  </td>
	</tr>

´´´


## Variables

Todo color de fondo, de texto, de botde o padding ha de definirse como una variable en

_utils-sass -> _vars

Si queremos cambiar el tamaño del 

## Toolkit

Todos los atomos han de presentarse de manera independiente en toolkit.html para que pueda servir como hoja de referencia para hacer nuevos módulos. La unión de atomos + layout nos dan los organismos















