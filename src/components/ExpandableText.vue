<script setup>
import { ref, onMounted, nextTick } from 'vue';

//------------------------------------------------------------------- VARIABLES
// `expanded` es una variable reactiva que indica si el texto está expandido o no.
const expanded = ref(false);

// `isTruncated` es una variable reactiva que indica si el texto necesita ser truncado.
const isTruncated = ref(false);

// `textContainer` es una referencia al elemento DOM que contiene el texto.
const textContainer = ref(null);

// `maxHeight` es una variable reactiva que almacena la altura máxima del contenedor de texto cuando está truncado.
const maxHeight = ref(0);

//------------------------------------------------------------------- METHODS
// `toggleExpand` alterna el estado de `expanded` y ajusta la altura máxima del contenedor de texto.
function toggleExpand() {
	expanded.value = !expanded.value;
	if (!expanded.value) {
		// Si el texto no está expandido, establece la altura máxima al valor de `maxHeight`.
		nextTick(() => {
			textContainer.value.style.maxHeight = `${maxHeight.value}px`;
		});
	} else {
		// Si el texto está expandido, establece la altura máxima al valor de `scrollHeight` del contenedor.
		textContainer.value.style.maxHeight = `${textContainer.value.scrollHeight}px`;
	}
}

//------------------------------------------------------------------- PROPS
// Define las propiedades que el componente acepta.
defineProps({
	text: {
		type: String,
		required: true // `text` es una cadena de texto que se mostrará en el componente.
	},
	maxLength: {
		type: Number,
		default: 150 // `maxLength` es el número máximo de caracteres antes de truncar el texto.
	},
	linkToPost: {
		type: String,
		default: '' // `linkToPost` es un enlace opcional a una publicación.
	}
});

//------------------------------------------------------------------- LIFECYCLE
// `onMounted` se ejecuta cuando el componente se monta en el DOM.
onMounted(() => {
	nextTick(() => {
		// Obtiene el contenedor de texto.
		const container = textContainer.value;
		// Obtiene la altura de una línea de texto.
		const lineHeight = parseFloat(getComputedStyle(container).lineHeight);
		// Calcula la altura de dos líneas de texto.
		maxHeight.value = lineHeight * 2;
		// Si el contenido del contenedor es mayor que la altura de dos líneas, necesita ser truncado.
		if (container.scrollHeight > maxHeight.value) {
			isTruncated.value = true;
		}
		// Establece la altura inicial del contenedor de texto.
		container.style.maxHeight = `${maxHeight.value}px`;
	});
});
</script>

<template>
	<div class="max-width-text">
		<!-- Si `linkToPost` tiene un valor, envuelve el texto en un enlace de RouterLink. -->
		<template v-if="linkToPost.length">
			<RouterLink :to="{ name: 'Post', params: { id: linkToPost } }">
				<p ref="textContainer"
					class="text-pretty break-words whitespace-pre-wrap overflow-hidden transition-max-height duration-300 ease-in-out"
					:style="{ maxHeight: expanded ? 'none' : `${maxHeight}px` }">
					{{ text }}
				</p>
			</RouterLink>
		</template>
		<!-- Si `linkToPost` no tiene un valor, muestra el texto sin enlace. -->
		<template v-else>
			<p ref="textContainer"
				class="text-pretty break-words whitespace-pre-wrap overflow-hidden transition-max-height duration-300 ease-in-out"
				:style="{ maxHeight: expanded ? 'none' : `${maxHeight}px` }">
				{{ text }}
			</p>
		</template>
		<!-- Muestra el botón para expandir o contraer el texto si necesita ser truncado. -->
		<button v-if="isTruncated" type="button" @click="toggleExpand"
			class="text-blue-500 hover:underline w-full text-start">
			{{ expanded ? 'Ver menos' : 'Ver más' }}
		</button>
	</div>
</template>

<style scoped>
/* Clase para la transición suave de la altura máxima del contenedor de texto. */
.transition-max-height {
	transition: max-height 0.3s ease-in-out;
}

/* Clase para limitar el ancho máximo del contenedor principal. */
.max-width-text {
	max-width: calc(100dvw - 56px);
}
</style>