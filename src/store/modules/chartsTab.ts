import {VuexModule, Module, Mutation, Action, getModule} from 'vuex-module-decorators';
import examples from '@/assets/data/echartsOption/index';
import indicatorArr from '@/assets/data/indicatorOption/index';
import scrollBoardArr from '@/assets/data/scrollBoardOption/index';
import {storeModuleConfig} from '@/utils';

const logArr: Example[] = [
  {
    echartId: '1',
    componentType: 'v-log',
    tabType: 'rz',
    title: '操作日志',
    subtitle: '',
    introduce: '该图表为操作实时日志',
    option: {
      title: '操作日志',
      type: 'debug',
      ws: true,
    },
  },
  {
    echartId: '2',
    componentType: 'v-log',
    tabType: 'rz',
    title: '异常日志',
    subtitle: '',
    introduce: '该图表为异常实时日志',
    option: {
      title: '异常日志',
      type: 'error',
      ws: true,
    },
  },
];

const capsuleArr: Example[] = [
  {
    echartId: '1',
    componentType: 'v-capsule',
    tabType: 'jn',
    title: '源端对象胶囊图',
    subtitle: '',
    introduce: '该图表为源端对象胶囊图',
    option: {
      url: '/dashboard/homePageData/getNumber?type=1',
      title: '源端对象',
    },
  },
  {
    echartId: '2',
    componentType: 'v-capsule',
    tabType: 'jn',
    title: '目标对象胶囊图',
    subtitle: '',
    introduce: '该图表为目标对象胶囊图',
    option: {
      url: '/dashboard/homePageData/getNumber?type=2',
      title: '目标对象',
    },
  },
];

const taskArr: Example[] = [
  {
    echartId: '1',
    componentType: 'v-task',
    tabType: 'rw',
    title: '任务看板',
    subtitle: '',
    introduce: '该图表为目标对象胶囊图',
    option: {
      children: [],
      title: '执行任务',
    },
  },
];
(scrollBoardArr as Example[]).forEach(item => {
  if (item.option.url.indexOf('task') !== -1) {
    taskArr[0].option.children.push(item);
  }
});

@Module(storeModuleConfig('chartsTab'))
export default class ChartsTab extends VuexModule implements StoreChartsTab {
  public tabTags: TabTag[] = [
    {value: 'zzt', label: '柱状图'},
    {value: 'zxt', label: '折线图'},
    {value: 'bt', label: '饼图'},
    {value: 'ldt', label: '雷达图'},
    {value: 'rlt', label: '热力图'},
    {value: 'dt', label: '地图'},
    {value: 'lb', label: '轮播列表'},
    {value: 'zb', label: '指标'},
    {value: 'jn', label: '胶囊图'},
    {value: 'rz', label: '日志'},
    {value: 'rw', label: '任务'},
  ];

  // @ts-ignore
  public exampleList = [
    ...Object.keys(examples)
      .map((item: string): Example[] => {
        // @ts-ignore
        return examples[item];
      })
      .reduce((a, b): Example[] => {
        return a.concat(b);
      }),
    ...[...indicatorArr, ...scrollBoardArr, ...capsuleArr, ...logArr, ...taskArr],
  ];
}

export const ChartsTabModule = getModule(ChartsTab);
