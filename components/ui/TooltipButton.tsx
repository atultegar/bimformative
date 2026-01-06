"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import SimpleTooltip from "@/components/ui/SimpleTooltip";

type Props = ButtonProps & {
    tooltip: string;
}

export default function TooltipButton({
    tooltip,
    disabled,
    children,
    ...props
}: Props) {
    if (disabled) {
        return (
            <SimpleTooltip label={tooltip}>
                <span className="inline-flex cursor-not-allowed">
                    <Button disabled {...props}>
                        {children}                        
                    </Button>
                </span>
            </SimpleTooltip>
        );
    }

    return (
        <SimpleTooltip label={tooltip}>
            <Button {...props}>{children}</Button>
        </SimpleTooltip>
    );
}