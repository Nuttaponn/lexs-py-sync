import { Injector, ComponentFactoryResolver, ApplicationRef, EmbeddedViewRef } from '@angular/core';

export function appendRootComponent(injector: Injector, component: any) {
  return () => {
    const componentFactoryResolver = injector.get(ComponentFactoryResolver);
    const applicationRef = injector.get(ApplicationRef);
    const componentFactory = componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = componentFactory.create(injector);
    applicationRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  };
}
