<template>
  <q-page class="flex flex-center">
    <img alt="Forest CRM" src="statics/logo.jpg">
    <div class="row flex-center hidden">
        <div class="col-3 flex column" style="width: 20vw; height: 46vh">
          <template v-for="i in 31">
          	<div class="text-right">
              <input type="checkbox" @change="$refs['in'+i][0].disabled = !$refs['in'+i][0].disabled">{{i}}</input>
              <input type="number" disabled :ref="'in' + i" style="width: 50px; height: 20px;" />
          </div>
          </template>
        </div>
      </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',

}
</script>
