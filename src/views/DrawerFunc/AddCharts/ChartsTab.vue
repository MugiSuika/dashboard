<template>
  <v-tabs class="flex-shrink-1" background-color="dark" color="success accent-4" right @change="tabChangeHandle">
    <v-tab v-for="item in this.ChartsTabModule.tabTags" :item="item.value" :key="item.value">{{ item.label }}</v-tab>

    <v-tab-item v-for="n in this.ChartsTabModule.tabTags.length" :key="n">
      <keep-alive>
        <v-container fluid style="width: 100%;height: 600px;overflow-y: auto">
          <v-row>
            <v-col v-for="item in tabActiveExampleList" :key="item.title" cols="12" md="4" transition="slide-x-transition">
              <ChartCard :info="item" />
            </v-col>
          </v-row>
        </v-container>
      </keep-alive>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ChartCard from '@/components/ChartCard.vue';
import {ChartsTabModule} from '@/store/modules/chartsTab';

@Component({
  components: {
    ChartCard,
  },
})
export default class ChartsTab extends Vue {
  public ChartsTabModule = ChartsTabModule;

  /**
   * 当前点击标签
   */
  public tabActiveTag: string | undefined = '';

  /**
   * 当前展示事例
   */
  public tabActiveExampleList: Example[] = [];

  /**
   * 依次渲染时间
   */
  readonly RENDER_SECONDS: number = 1;

  /**
   * 定时器
   */
  public timer: any;

  // /**
  //  * 当前展示事例
  //  */
  // public get tabActiveExampleList(): Example[] {
  //   return (this.exampleList as Example[]).filter((item: Example) => {
  //     return item.tabType === this.tabActiveTag;
  //   });
  // }

  /**
   * tab变化回调
   * @param idx 下标
   */
  public tabChangeHandle(idx: number) {
    this.tabActiveExampleList = [];
    clearTimeout(this.timer);
    this.tabActiveTag = (this.ChartsTabModule.tabTags as TabTag[])[idx].value;
    const arr = (this.ChartsTabModule.exampleList as Example[]).filter((item: Example) => {
      return item.tabType === this.tabActiveTag;
    });
    const sArr = arr.map((item, idx) => idx * this.RENDER_SECONDS);
    for (const i of sArr) {
      this.timer = setTimeout(() => {
        this.tabActiveExampleList.push(arr[i / this.RENDER_SECONDS]);
      }, i);
    }
  }
}
</script>
